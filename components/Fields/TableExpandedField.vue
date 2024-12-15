<template>
  <td :colspan="headers.length" class="table-expanded-field">
    <v-card>
      <v-tabs vertical>
        <v-tab class="location_photos_tab">
          <v-icon v-if="isMobile">mdi-image-marker</v-icon>
          <span v-else>Helyszín fotók</span>
        </v-tab>
        <v-tab class="location_details_tab">
          <v-icon v-if="isMobile">mdi-map-marker-alert</v-icon>
          <span v-else>Helyszín részletek</span>
        </v-tab>
        <v-tab v-if="$store.getters['hasPermission']('6')" class="fees">
          <v-icon v-if="isMobile">mdi-cash-check</v-icon>
          <span v-else>Díjak</span></v-tab
        >
        <v-tab
          v-for="locker in item.lockers"
          v-bind:key="locker.id"
          class="locker_tab"
        >
          <v-icon v-if="isMobile && locker.type === 'Master'"
            >mdi-locker</v-icon
          >
          <v-icon v-else-if="isMobile && locker.type === 'Slave'"
            >mdi-locker-multiple</v-icon
          >
          <span v-else>{{ locker.serial }}</span>
        </v-tab>

        <v-tab-item class="location_photos_item">
          <v-card flat>
            <v-row>
              <v-col
                v-for="(photo, index) in item.location_photos"
                :key="index"
                :class="colClass"
              >
                <a :href="photo.url" target="_blank" rel="noopener noreferrer">
                  <v-img
                    :src="photo.url"
                    aspect-ratio="1"
                    class="grey lighten-2"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </a>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-12 col-sm-3 col-md-3 col-lg-2 col-xl-2">
                <template>
                  <form @submit.prevent="uploadTaskFile(item)">
                    <v-file-input
                      :rules="rules"
                      v-model="taskFiles"
                      accept="image/png, image/jpeg, image/bmp"
                      prepend-icon="mdi-camera"
                      color="primary"
                      counter
                      label="Kép feltöltés"
                      outlined
                      required
                      :disabled="isToDisable(item)"
                    ></v-file-input>
                    <v-btn
                      type="submit"
                      :disabled="isToDisable(item)"
                      class="mt-4 mb-4"
                      >Feltöltés</v-btn
                    >
                  </form>
                </template>
              </v-col>
            </v-row>
          </v-card>
          <!-- <v-col cols="2"> -->

          <!-- </v-col> -->
        </v-tab-item>
        <v-tab-item class="location_details">
          <v-card flat>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="fixingMethod"
                label="Rögzítési mód"
                :disabled="isToDisable(item)"
                @change="
                  updateLocationData(
                    item,
                    'task_locations',
                    'fixing_method',
                    'fixingMethod'
                  )
                "
              >
              </v-text-field>
              <v-text-field
                v-model="sitePreparation"
                label="Helyszín kialakítási feladat"
                :disabled="isToDisable(item)"
                @change="
                  updateLocationData(
                    item,
                    'task_locations',
                    'required_site_preparation',
                    'sitePreparation'
                  )
                "
              ></v-text-field>
              <v-textarea
                v-model="comment"
                label="Megjegyzés"
                :disabled="isToDisable(item)"
                @change="
                  updateLocationData(
                    item,
                    'task_locations',
                    'comment',
                    'comment'
                  )
                "
              ></v-textarea>
            </v-col>
          </v-card>
        </v-tab-item>
        <v-tab-item class="fees">
          <FeesField
            :taskTypes="taskTypes"
            :taskFees="item.taskFees"
            :fees="fees"
            :taskId="item.id"
            :lockers="item.lockers"
            :lockerSerials="item.lockerSerials"
            :disabled="isToDisable(item)"
            @addFee="addFee"
            @deleteFee="deleteFee"
          />
        </v-tab-item>
        <v-tab-item
          v-for="locker in item.lockers"
          v-bind:key="locker.id"
          class="locker_item"
        >
          <LockerField
            :locker="locker"
            :taskId="item.id"
            @updateLockerData="updateLockerData"
          />
        </v-tab-item>
      </v-tabs>
    </v-card>
  </td>
</template>

<script>
import FeesField from './FeesField.vue';
import LockerField from './LockerField.vue';

export default {
  components: { FeesField, LockerField },
  props: {
    item: Object,
    taskTypes: Array,
    headers: Array,
    rules: Array,
    fees: Array
  },
  data() {
    return {
      fixingMethod: this.item.fixing_method,
      sitePreparation: this.item.required_site_preparation,
      comment: this.item.comment,
      taskFiles: [],
      isMobile: false
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  computed: {
    colClass() {
      return this.isMobile
        ? 'col-5 col-md-3 col-lg-2 col-xl-2'
        : 'col-12 col-sm-2 col-md-3 col-lg-2 col-xl-2';
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    isToDisable(item) {
      if (
        item.status_exohu_id === 10 &&
        !this.$store.getters['hasPermission']('7')
      ) {
        return true;
      }
      if (
        item.status_exohu_id === 9 &&
        !this.$store.getters['hasPermission']('8')
      ) {
        return true;
      }
    },
    uploadTaskFile(data) {
      console.log(data);
      this.$emit('uploadTaskFile', {
        taskId: data.id,
        locationId: data.location_id,
        fileUpload: true,
        file: this.taskFiles
      });
    },
    updateLocationData(item, dbTable, dbColumn, key) {
      this.$emit(
        'updateTask',
        {
          dbTable: dbTable,
          dbColumn: dbColumn
        },
        { id: item.id, value: this[key] }
      );
    },
    updateLockerData(data) {
      this.$emit('updateLockerData', data);
    },
    addFee(data) {
      this.$emit('addFee', data);
    },
    deleteFee(data) {
      this.$emit('deleteFee', data);
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 480;
    }
  }
};
</script>

<style>
@media (max-width: 600px) {
  .table-expanded-field {
    display: contents;
  }
}
</style>

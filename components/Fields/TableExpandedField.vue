<template>
  <td :colspan="headers.length" class="table-expanded-field">
    <v-card>
      <v-tabs vertical>
        <v-tab class="location_photos_tab">Helyszín képek</v-tab>
        <v-tab class="location_details_tab">Helyszín részletek</v-tab>
        <v-tab v-if="$store.getters['hasPermission']('6')" class="fees"
          >Díjak</v-tab
        >
        <v-tab
          v-for="locker in item.lockers"
          v-bind:key="locker.id"
          class="locker_tab"
        >
          {{ locker.serial }}
        </v-tab>

        <v-tab-item class="location_photos_item">
          <v-card flat>
            <v-row>
              <v-col
                v-for="(photo, index) in item.location_photos"
                :key="index"
                class="col-12 col-sm-3 col-md-3 col-lg-2 col-xl-2"
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
                    'Task_locations',
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
                    'Task_locations',
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
                    'Task_locations',
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
            :taskId="item.id"
            :lockers="item.lockers"
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
    rules: Array
  },
  data() {
    return {
      fixingMethod: this.item.fixing_method,
      sitePreparation: this.item.required_site_preparation,
      comment: this.item.comment,
      taskFiles: []
    };
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

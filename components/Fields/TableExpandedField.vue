<template>
  <td :colspan="headers.length" class="table-expanded-field">
    <v-card>
      <v-tabs vertical>
        <v-tab class="location_photos_tab">
          <v-icon v-if="isMobile">mdi-image-marker</v-icon>
          <span v-else>
            <v-icon>mdi-image-marker</v-icon>
            Helyszín fotók</span
          >
        </v-tab>
        <v-tab class="location_details_tab">
          <v-icon v-if="isMobile">mdi-map-marker-alert</v-icon>
          <span v-else>
            <v-icon>mdi-map-marker-alert</v-icon>
            Megbízás részletei</span
          >
        </v-tab>
        <v-tab v-if="$store.getters['hasPermission']('6')" class="fees">
          <v-icon v-if="isMobile">mdi-cash-check</v-icon>
          <span v-else>
            <v-icon>mdi-cash-check</v-icon>
            Díjak</span
          ></v-tab
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
          <span v-else>
            <v-icon v-if="locker.type === 'Master'">mdi-locker</v-icon>
            <v-icon v-else-if="locker.type === 'Slave'"
              >mdi-locker-multiple</v-icon
            >
            {{ locker.serial }}</span
          >
        </v-tab>

        <v-tab-item class="location_photos_item">
          <v-card flat>
            <v-row>
              <v-col
                v-for="(photo, index) in item.location_photos"
                :key="index"
                :class="colClass"
              >
                <v-card max-width="250">
                  <a
                    :href="photo.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <v-img
                      :src="photo.url"
                      class="white--text align-end"
                      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                      height="200"
                    >
                      <v-card-title></v-card-title>
                    </v-img>
                  </a>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="deletePhoto(photo)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
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
                label="Megbízás leírása"
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
              <v-textarea
                v-model="lockerApproach"
                label="Megközelítés"
                :disabled="isToDisable(item)"
                placeholder="Add meg, hogyan találja meg a címzett.."
                @change="
                  updateLocationData(
                    item,
                    'task_locations',
                    'locker_approach',
                    'lockerApproach'
                  )
                "
              ></v-textarea>
              <v-textarea
                v-model="feedback"
                label="Report"
                :disabled="isToDisable(item)"
                @change="
                  updateLocationData(
                    item,
                    'task_locations',
                    'company_feedback',
                    'feedback'
                  )
                "
              ></v-textarea>
            </v-col>
          </v-card>
        </v-tab-item>
        <v-tab-item v-if="$store.getters['hasPermission']('6')" class="fees">
          <v-col cols="12" sm="6" md="8" lg="8" xl="8">
            <FeesField
              :taskTypes="item.taskTypes"
              :taskFees="item.taskFees"
              :fees="fees"
              :taskId="item.id"
              :lockers="item.lockers"
              :lockerSerials="item.lockerSerials"
              :disabled="isToDisable(item)"
              @addFee="addFee"
              @deleteFee="deleteFee"
            />
          </v-col>
        </v-tab-item>
        <v-tab-item
          v-for="locker in item.lockers"
          v-bind:key="locker.id"
          class="locker_item"
        >
          <v-col cols="12" sm="6" md="8" lg="8" xl="8">
            <LockerField
              :locker="locker"
              :taskId="item.id"
              @updateLockerData="updateLockerData"
              @verifyLocker="verifyLocker"
            />
          </v-col>
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
      feedback: this.item.feedback,
      lockerApproach: this.item.lockerApproach,
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
        { id: item.location_id, value: this[key] }
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
    deletePhoto(photo) {
      this.showModal(photo);
      //this.$emit('deletePhoto', photo);
    },
    verifyLocker(locker) {
      this.$emit('verifyLocker', locker);
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 480;
    },
    showModal(photo) {
      this.$store.dispatch('notification/showModal', {
        message: 'Biztosan törölni szeretnéd?',
        buttons: [
          {
            text: 'Igen',
            style: 'primary',
            action: () => this.$emit('deletePhoto', photo)
          },
          {
            text: 'Mégse',
            style: 'secondary',
            action: () => this.$store.dispatch('notification/hideModal')
          }
        ]
      });
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

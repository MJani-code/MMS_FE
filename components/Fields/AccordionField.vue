<template>
  <v-expansion-panel
    class="accordion"
    :style="'borderLeft: 4px solid' + statusColor"
  >
    <v-expansion-panel-header @click="handleHeaderClick">
      {{ title }}
      <span class="text-left ml-2">{{ displayCount }}</span>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <TableField
        :isLoading="isLoading"
        :tasks="loadedTasks"
        :headers="headers"
        :statuses="statuses"
        :fees="fees"
        :allowedStatuses="allowedStatuses"
        :locationTypes="locationTypes"
        :taskTypes="taskTypes"
        :lockerSerials="lockerSerials"
        :companies="companies"
        :priorities="priorities"
        @eventToAccordion="eventToTask"
        @updateLockerData="updateLockerData"
        @bulkUpdateLockerData="bulkUpdateLockerData"
        @uploadTaskFile="eventToTask"
        @addFee="addFee"
        @addLocker="addLocker"
        @deleteFee="deleteFee"
        @removeLocker="removeLocker"
        @downloadTig="downloadTig"
        @downloadTasks="downloadTasks"
        @verifyLocker="verifyLocker"
        @deletePhoto="deletePhoto"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { taskMixin } from '@/mixins/taskMixin.js';

export default {
  components: {
    TableField: () => import('./TableField.vue')
  },
  mixins: [taskMixin],
  props: {
    title: String,
    statusId: [String, Number],
    statusColor: {
      type: String,
      default: '#ccc'
    },
    taskCount: {
      type: Number,
      default: 0
    },
    headers: Array,
    statuses: Array,
    fees: Array,
    allowedStatuses: Array,
    locationTypes: Array,
    taskTypes: Array,
    lockerSerials: Array,
    companies: Array,
    priorities: Array
  },
  data: () => ({
    panel: [0],
    readonly: false,
    isLoading: false,
    loadedTasks: [],
    isExpanded: false,
    hasLoadedOnce: false
  }),
  computed: {
    displayCount() {
      // Mindig a loadedTasks hosszát mutatjuk, ha be van töltve
      // Ha még nincs betöltve, akkor a taskCount prop-ot
      if (this.loadedTasks.length > 0 || this.hasLoadedOnce) {
        return this.loadedTasks.length;
      }
      return this.taskCount;
    }
  },
  watch: {
    // Figyeljük a loadedTasks változását és jelezzük a szülőnek
    'loadedTasks.length'(newLength) {
      if (this.hasLoadedOnce) {
        this.$emit('countChanged', {
          statusId: this.statusId,
          count: newLength
        });
      }
    }
  },
  mounted() {},
  methods: {
    handleHeaderClick() {
      // A kattintás után várunk egy kicsit, hogy a Vuetify feldolgozza az állapot változást
      this.$nextTick(() => {
        // Az expansion panel állapota most már frissült
        const willBeExpanded = !this.isExpanded;
        this.isExpanded = willBeExpanded;

        if (willBeExpanded && !this.hasLoadedOnce) {
          this.loadTasksForStatus();
        }
      });
    },
    async loadTasksForStatus() {
      this.isLoading = true;
      try {
        const response = await this.fetchTasksByStatus(this.statusId);

        if (response.data.status === 200) {
          this.loadedTasks = response.data.data || [];

          // D4ME lokációk adatainak betöltése
          const d4meResult = await this.fetchDirect4MeLocations();
          if (d4meResult.data.status === 200) {
            this.enrichTasksWithLocationData(
              this.loadedTasks,
              d4meResult.data.data
            );
          }

          this.$emit('tasksLoaded', {
            statusId: this.statusId,
            tasks: this.loadedTasks
          });
        } else {
          this.showNotification(
            'error',
            response.data.message || 'Hiba történt az adatok betöltése során'
          );
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        this.showNotification(
          'error',
          'Hiba történt az adatok betöltése során'
        );
      } finally {
        this.isLoading = false;
      }
    },
    enrichTasksWithLocationData(tasks, locations) {
      tasks.forEach((task) => {
        const location = locations.find((loc) => loc.id === task.box_id);
        if (location) {
          if (task.lockers && task.lockers.length > 0) {
            task.lockers.forEach((locker) => {
              locker['is_registered'] = 1;
              locker['is_active'] = 1;
            });
          }
          task['longitude'] = location.longitude;
          task['latitude'] = location.latitude;

          if (!task.location_photos) {
            task.location_photos = [];
          }

          if (location.images?.images?.length > 0) {
            const currentPhotos = task.location_photos.map((p) => p.url);
            location.images.images.forEach((image) => {
              if (image.imagePath && !currentPhotos.includes(image.imagePath)) {
                task.location_photos.push({ url: image.imagePath });
              }
            });
          }
        }
      });
    },
    async refreshTasks() {
      // Külső hívásra frissítjük az adatokat
      this.hasLoadedOnce = false;
      if (this.isExpanded) {
        await this.loadTasksForStatus();
        this.hasLoadedOnce = true;
      }
    },
    eventToTask(payload) {
      // Hozzáadjuk a statusId-t minden eventhez
      this.$emit('eventToTask', { ...payload, statusId: this.statusId });
    },
    addFee(data) {
      this.$emit('addFee', { ...data, statusId: this.statusId });
    },
    addLocker(data) {
      this.$emit('addLocker', { ...data, statusId: this.statusId });
    },
    removeLocker(data) {
      this.$emit('removeLocker', { ...data, statusId: this.statusId });
    },
    deleteFee(data) {
      this.$emit('deleteFee', { ...data, statusId: this.statusId });
    },
    deletePhoto(data) {
      this.$emit('deletePhoto', { ...data, statusId: this.statusId });
    },
    updateLockerData(data) {
      this.$emit('updateLockerData', { ...data, statusId: this.statusId });
    },
    bulkUpdateLockerData(data) {
      this.$emit('bulkUpdateLockerData', { ...data, statusId: this.statusId });
    },
    downloadTig(data) {
      this.$emit('downloadTig', { ...data, statusId: this.statusId });
    },
    downloadTasks(data) {
      this.$emit('downloadTasks', { ...data, statusId: this.statusId });
    },
    verifyLocker(data) {
      this.$emit('verifyLocker', { ...data, statusId: this.statusId });
    }
  }
};
</script>

<style>
.accordion {
  margin-bottom: 10px;
}
.custom-border {
  border-left: 4px solid #42b983; /* Állítsd be a kívánt színt és vastagságot */
}
</style>

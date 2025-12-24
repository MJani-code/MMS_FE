<template>
  <div v-if="groupedTasks" class="mt-6">
    <PagesTasksTaskFilter
      :admin-filter-options="adminFilterOptions"
      :serial-filter-options="serialFilterOptions"
      :tasks="tasks.data"
      :download-new-points="downloadNewPoints"
      @searchedValue="filteredTasks"
      @tofShopIdFilter="filteredTasks"
      @serialFilter="filteredTasks"
      @createTask="handleCreateTask"
      @uploadBatchTasks="handleUploadBatchTasks"
    />
    <v-expansion-panels v-model="expandedAccordions" multiple>
      <AccordionField
        v-for="(group, statusId, index) in groupedTasks"
        :key="index"
        :title="group.title"
        :tasks="group.tasks"
        :headers="tasks.headers"
        :statuses="tasks.statuses"
        :fees="tasks.fees"
        :allowed-statuses="tasks.allowedStatuses"
        :location-types="tasks.locationTypes"
        :task-types="tasks.taskTypes"
        :locker-serials="tasks.lockerSerials"
        :companies="tasks.companies"
        @eventToTask="handleUpdatedTask"
        @updateLockerData="handleUpdatedLockerData"
        @bulkUpdateLockerData="handleBulkUpdateLockerData"
        @addFee="handleAddFee"
        @addLocker="handleAddLocker"
        @deleteFee="handleDeleteFee"
        @removeLocker="handleRemoveLocker"
        @downloadTig="handleDownloadTig"
        @downloadTasks="handleDownloadTasks"
        @verifyLocker="handleVerifyLocker"
        @deletePhoto="handleDeletePhoto"
      >
      </AccordionField>
    </v-expansion-panels>
  </div>
  <v-sheet v-else>
    <v-card-title class="text-h5">Nincs megjeleníthető adat</v-card-title>
  </v-sheet>
</template>

<script>
import { taskMixin } from '@/mixins/taskMixin.js';
import AccordionField from '../../components/Fields/AccordionField.vue';
import axios from 'axios';

export default {
  name: 'AdminTasks',
  components: { AccordionField },
  mixins: [taskMixin],
  data() {
    return {
      tasks: {
        data: [],
        headers: [],
        statuses: [],
        locationTypes: [],
        users: [],
        fees: []
      },
      searchQuery: '',
      adminFilterOptions: [
        { text: 'Összes tétel', value: null },
        { text: 'Adminban aktiv', value: true },
        { text: 'Adminban nem aktív', value: false }
      ],
      serialFilterOptions: [
        { text: 'Összes', value: null },
        { text: 'Van serial', value: true },
        { text: 'Nincs serial', value: false }
      ],
      selectedAdminFilter: null,
      selectedSerialFilter: null,
      expandedAccordions: [] // Nyitott accordionok ID-jai
    };
  },
  watch: {
    // '$store.state.notification.bellEvent': {
    //   handler(newVal) {
    //     if (newVal && newVal.type === 'special' && newVal.toRefresh) {
    //       this.turnOnLoading();
    //       this.getTasks();
    //       this.$store.commit('notification/setBellEvent', null);
    //     }
    //   },
    //   immediate: true
    // }
  },
  computed: {
    groupedTasks() {
      if (!this.tasks.data || !this.tasks.statuses) {
        return {};
      }

      if (this.searchQuery) {
        var query = this.searchQuery.toLowerCase();
      }

      var filteredTasks = !query
        ? this.tasks.data
        : this.tasks.data.filter((task) =>
            this.objectContainsQuery(task, query)
          );

      if (this.selectedAdminFilter !== null) {
        filteredTasks = filteredTasks.filter(
          (task) => task.isActiveInAdmin === this.selectedAdminFilter
        );
      }

      if (this.selectedSerialFilter !== null) {
        if (this.selectedSerialFilter === true) {
          filteredTasks = filteredTasks.filter(
            (task) => task.lockerSerials && task.lockerSerials.length > 0
          );
        } else {
          filteredTasks = filteredTasks.filter(
            (task) => !task.lockerSerials || task.lockerSerials.length === 0
          );
        }
      }

      const statusMap = this.tasks.statuses.reduce((map, status) => {
        map[status.id] = status.name;
        return map;
      }, {});

      return filteredTasks.reduce((groups, task) => {
        const statusId = task.status_exohu_id;
        const statusText = statusMap[statusId] || 'Ismeretlen státusz';

        if (!groups[statusId]) {
          groups[statusId] = {
            title: statusText,
            tasks: []
          };
        }

        groups[statusId].tasks.push(task);
        return groups;
      }, {});
    }
  },
  async mounted() {
    this.turnOnLoading();
    await this.getTasks();
  },
  methods: {
    objectContainsQuery(obj, query) {
      // Ellenőrizzük az összes kulcsot és értéket
      return Object.entries(obj).some(([key, value]) => {
        if (Array.isArray(value)) {
          // Ha a kulcs értéke tömb, rekurzívan végigmegyünk minden elemén
          return value.some((item) =>
            typeof item === 'object'
              ? this.objectContainsQuery(item, query)
              : String(item).toLowerCase().includes(query)
          );
        }
        // Ha szöveges érték, alapértelmezett keresés
        return String(value).toLowerCase().includes(query);
      });
    },
    filteredTasks(searchedValue) {
      if (searchedValue.key === 'tofShopIdFilter') {
        this.selectedAdminFilter = searchedValue.value;
      } else if (searchedValue.key === 'serialFilter') {
        this.selectedSerialFilter = searchedValue.value;
      } else if (searchedValue.key === 'search') {
        this.searchQuery = searchedValue.value;
      }
    },
    turnOnLoading() {
      this.$store.commit('turnOnLoading');
    },
    turnOffLoading() {
      this.$store.commit('turnOffLoading');
    },
    showModal() {
      this.$store.dispatch('notification/showModal', {
        message: 'Biztosan törölni szeretnéd?',
        buttons: [
          { text: 'Igen', style: 'primary', action: '' },
          {
            text: 'Mégse',
            style: 'secondary',
            action: () => this.$store.dispatch('notification/hideModal')
          }
        ]
      });
    },
    async handleUploadBatchTasks(payload) {
      try {
        const result = await this.uploadBatchTasks(payload);
        if (result.data.status === 200) {
          this.getTasks();
          this.showNotification('success', result.data.message);
        } else {
          this.showNotification('error', result.data.message);
        }
      } catch (error) {
        this.showNotification('error', error);
      }
      this.$store.commit('closeCreateTaskBatchModal');
      this.turnOffLoading();
    },
    async handleCreateTask(payload) {
      try {
        const result = await this.createTask(payload);
        if (result.data.status === 200) {
          this.getTasks();
          this.showNotification('success', result.data.message);
        } else {
          this.showNotification('error', result.data.message);
        }
      } catch (error) {
        this.showNotification('error', error);
      }
      this.$store.commit('closeCreateTaskModal');
      this.turnOffLoading();
    },
    async getTasks() {
      const result = await this.fetchTasks();
      if (result.data.status === 200) {
        this.tasks = result.data;
        this.tasks.headers.unshift({ text: '', value: 'data-table-expand' });
      } else {
        this.showNotification('error', result.data.message);
      }

      const d4meResult = await this.fetchDirect4MeLocations();
      if (d4meResult.data.status === 200) {
        var currentPhotos = [];
        //d4meResult.data id-t megkeresni a tasks.data box_id-ban
        this.tasks.data.forEach((task) => {
          const location = d4meResult.data.data.find(
            (loc) => loc.id === task.box_id
          );
          if (location) {
            if (task.lockers.length > 0) {
              task.lockers.forEach((locker) => {
                locker['is_registered'] = 1;
                locker['is_active'] = 1;
              });
            }
            task['longitude'] = location.longitude;
            task['latitude'] = location.latitude;
            if (
              location.images['images'] &&
              location.images['images'].length > 0
            ) {
              location.images['images'].forEach((image) => {
                if (
                  image.imagePath &&
                  !currentPhotos.includes(image.imagePath)
                ) {
                  currentPhotos.push(image.imagePath);
                  task.location_photos.push({ url: image.imagePath });
                }
              });
            }
          }
        });
      } else {
        this.showNotification('error', d4meResult.data.message);
      }
      this.turnOffLoading();
    },
    async handleUpdatedLockerData(payload) {
      const result = await this.updateTask(payload);
      if (result.data.status === 200) {
        const newValue = result.data.payload.value;
        const lockerId = result.data.payload.id;
        const column = result.data.payload.column;
        const taskId = result.data.payload.taskId;

        const task = this.tasks.data.find((item) => item.id === taskId);
        const locker = task.lockers.find((item) => item.id === lockerId);

        if (task && locker) {
          locker[column] = newValue;
        } else {
          const error = 'Nem található a ' + lockerId + ' locker';
          this.showNotification('error', error);
        }
      } else {
        this.showNotification('error', result.data.message);
      }
    },
    async handleBulkUpdateLockerData(payload) {
      const taskIds = payload.taskIds;
      const column = payload.column;
      const value = payload.value;
      const color = payload.color;

      //megkeressük a taskokat
      const tasksToUpdate = this.tasks.data.filter((task) =>
        taskIds.includes(task.id)
      );

      //frissítjük a locker adatokat
      tasksToUpdate.forEach((task) => {
        task[column] = value;
        if (column == 'status_by_exohu_id') {
          task.status_color = color;
          task.status_exohu = payload.status_exohu;
          task.status_exohu_id = value;
        }
      });
    },
    async handleUpdatedTask(payload) {
      const result = await this.updateTask(payload);
      const isPhotoUpload = result.data.payload?.photoUpload;
      const color = payload.color;

      if (result.data.status === 200 && isPhotoUpload) {
        const locationId = result.data.payload.locationId;
        const newUrl = result.data.payload.url;
        const location = this.tasks.data.find(
          (item) => item.location_id === locationId
        );
        if (location) {
          location.location_photos.push({ url: newUrl });
        } else {
          const error = 'Nem található a location_id: ' + locationId;
          this.showNotification('error', error);
        }
      }
      if (result.data.status === 200 && !isPhotoUpload) {
        if (payload.dbTable === 'task_locations') {
          const locationId = result.data.payload.id;
          const column = result.data.payload.column;
          const newValue = result.data.payload.value;
          const location = this.tasks.data.find(
            (item) => item.location_id === locationId
          );
          if (location) {
            location[column] = newValue;
          } else {
            const error = 'Nem található a location_id: ' + locationId;
            this.showNotification('error', error);
          }
        } else {
          const taskId = result.data.payload.id;
          const column = result.data.payload.column;
          const newValue = result.data.payload.value;
          const lockerId = result.data.payload.id;

          const task = this.tasks.data.find((item) => item.id === taskId);
          if (task) {
            task[column] = newValue;
            if (column == 'status_by_exohu_id') {
              task.status_color = color;
            }
          } else {
            const error = 'Nem található a task_Id: ' + taskId;
            this.showNotification('error', error);
          }
        }
      }
      if (result.data.status !== 200) {
        this.showNotification('error', result.data.message);
      }
    },
    async handleAddFee(payload) {
      const result = await this.addFee(payload);

      if (result.data.status === 200) {
        const taskId = result.data.payload.taskId;
        const newFee = result.data.payload;
        const task = this.tasks.data.find((item) => item.id === taskId);
        if (task) {
          task.taskFees.push(newFee);
        } else {
          const error = 'Nem található a task_id: ' + taskId;
          this.showNotification('error', error);
        }
      }
    },
    async handleAddLocker(payload) {
      const result = await this.addLocker(payload);
      const message = result.data.message;

      if (result.data.status === 200) {
        const taskId = result.data.payload[0].taskId;
        const lockers = result.data.payload;
        const task = this.tasks.data.find((item) => item.id === taskId);
        if (task) {
          task.lockers = lockers;
        }
      } else {
        this.showNotification('error', message);
      }
    },
    async handleRemoveLocker(payload) {
      const result = await this.removeLocker(payload);
      const message = result.data.message;
      if (result.data.status !== 200) {
        this.showNotification('error', message);
      } else {
        this.tasks.data.forEach((item) => {
          const index = item.lockers.findIndex(
            (locker) => locker.id === payload.id
          );
          if (index !== -1) {
            // Eltávolítjuk az adott locker ID-t
            item.lockers.splice(index, 1);
          }
        });
      }
    },
    async handleDeleteFee(payload) {
      const result = await this.deleteFee(payload);
      if (result.data.status === 200) {
        const idToRemove = result.data.payload.id;
        const taskIdToRemove = result.data.payload.taskId;

        const task = this.tasks.data.find((task) =>
          task.taskFees.some(
            (fee) => fee.id === idToRemove && fee.taskId === taskIdToRemove
          )
        );
        if (task) {
          // Szűrjük a taskFees tömbjét úgy, hogy kizárjuk a megadott id- és taskId párost
          task.taskFees = task.taskFees.filter(
            (fee) => !(fee.id === idToRemove && fee.taskId === taskIdToRemove)
          );
        }
      } else {
        this.showNotification('error', result.data.message);
      }
    },
    async handleDeletePhoto(payload) {
      this.$store.dispatch('notification/hideModal');
      const result = await this.deletePhoto(payload);
      if (result.data.status === 200) {
        const taskLocationsId = result.data.payload.taskLocationsId;
        const photoUrl = result.data.payload.url;
        const task = this.tasks.data.find(
          (item) => item.location_id === taskLocationsId
        );
        if (task) {
          const photoIndex = task.location_photos.findIndex(
            (item) => item.url === photoUrl
          );
          if (photoIndex !== -1) {
            task.location_photos.splice(photoIndex, 1);
            this.showNotification('success', result.data.message);
          }
        }
      } else {
        this.showNotification('error', result.data.message);
      }
    },
    async handleDownloadTig(payload) {
      try {
        const response = await this.downloadTig(payload);

        // Létrehozunk egy URL-t a blob-hoz
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tig.xlsx'); // Állítsd be a fájl nevét
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        this.showNotification('error', error);
      }
    },
    async handleDownloadTasks(payload) {
      try {
        const response = await this.downloadTasks(payload);

        // Létrehozunk egy URL-t a blob-hoz
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'completedtasks.xlsx'); // Állítsd be a fájl nevét
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        this.showNotification('error', error);
      }
    },
    async handleVerifyLocker(payload) {
      const result = await this.verifyLocker(payload.data);
      if (result.data.status === 200) {
        const lockerId = result.data.payload.id;
        const taskId = payload.taskId;
        const task = this.tasks.data.find((item) => item.id === taskId);
        if (task) {
          const lockerIndex = task.lockers.findIndex(
            (item) => item.id === lockerId
          );
          if (lockerIndex !== -1) {
            this.$set(task.lockers, lockerIndex, result.data.payload);
          }
        }
      } else {
        this.showNotification('error', result.data.message);
      }
    },
    showNotification($type, $message) {
      this.$store.dispatch('notification/addNotification', {
        type: $type,
        message: $message,
        timeout: 5000
      });
    }
  }
};
</script>

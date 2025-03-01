<template>
  <div v-if="groupedTasks" class="mt-6">
    <AddTaskField
      @uploadBatchTasks="handleUploadBatchTasks"
      @searchedValue="filteredTasks"
      @createTask="handleCreateTask"
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
        :allowedStatuses="tasks.allowedStatuses"
        :locationTypes="tasks.locationTypes"
        :taskTypes="tasks.taskTypes"
        :lockerSerials="tasks.lockerSerials"
        :companies="tasks.companies"
        @eventToTask="handleUpdatedTask"
        @updateLockerData="handleUpdatedLockerData"
        @addFee="handleAddFee"
        @addLocker="handleAddLocker"
        @deleteFee="handleDeleteFee"
        @removeLocker="handleRemoveLocker"
        @downloadTig="handleDownloadTig"
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
import AddTaskField from '../../components/Fields/AddTaskField.vue';
import axios from 'axios';

export default {
  name: 'AdminTasks',
  components: { AccordionField, AddTaskField },
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
      expandedAccordions: [] // Nyitott accordionok ID-jai
    };
  },
  watch: {
    // groupedTasks(newValue) {
    //   this.expandedAccordions = Object.keys(newValue).map(Number);
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

      const filteredTasks = !query
        ? this.tasks.data
        : this.tasks.data.filter((task) =>
            this.objectContainsQuery(task, query)
          );

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
      this.searchQuery = searchedValue; // Frissítjük a keresési értéket
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

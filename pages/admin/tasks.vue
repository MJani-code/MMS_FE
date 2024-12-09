<template>
  <div class="mt-6">
    <AddTaskField
      @uploadBatchTasks="handleUploadBatchTasks"
      @searchedValue="filteredTasks"
    />
    <v-expansion-panels v-model="expandedAccordions" multiple>
      <AccordionField
        v-for="(group, statusId, index) in groupedTasks"
        :key="index"
        :title="group.title"
        :tasks="group.tasks"
        :headers="tasks.headers"
        :statuses="tasks.statuses"
        :allowedStatuses="tasks.allowedStatuses"
        :locationTypes="tasks.locationTypes"
        :taskTypes="tasks.taskTypes"
        :users="tasks.users"
        @eventToTask="handleUpdatedTask"
        @updateLockerData="handleUpdatedLockerData"
        @addFee="handleAddFee"
        @addLocker="handleAddLocker"
        @deleteFee="handleDeleteFee"
        @removeLocker="handleRemoveLocker"
      >
      </AccordionField>
    </v-expansion-panels>
  </div>
</template>

<script>
import { taskMixin } from '@/mixins/taskMixin.js';
import AccordionField from '../../components/Fields/AccordionField.vue';
import AddTaskField from '../../components/Fields/AddTaskField.vue';

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
        users: []
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
    await this.getTasks();
    console.log(this.tasks);
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
      console.log(this.$store.state.notification);
    },
    async handleUploadBatchTasks(payload) {
      try {
        const result = await this.uploadBatchTasks(payload);
        if (result.data.status === 200) {
          this.getTasks();
        } else {
          this.showNotification('error', result.data.message);
        }
      } catch (error) {
        this.showNotification('error', error);
      }
      this.turnOffLoading();
    },
    async getTasks() {
      //this.turnOnLoading();
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
        const taskId = result.data.payload.taskId;
        const column = result.data.payload.column;
        const newValue = result.data.payload.value;
        const lockerId = result.data.payload.id;

        const task = this.tasks.data.find((item) => item.id === taskId);
        if (task) {
          task[column] = newValue;
        } else {
          const error = 'Nem található a task_Id: ' + taskId;
          this.showNotification('error', error);
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
        const tofShopId = result.data.payload[0].tofShopId;
        const lockers = result.data.payload;
        const task = this.tasks.data.find(
          (item) => item.tof_shop_id === tofShopId
        );
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
            (locker) => locker.serial === payload.value // Feltétel: 'value' mező egyezése
          );
          if (index !== -1) {
            // Eltávolítjuk az adott lockerSerial-t
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

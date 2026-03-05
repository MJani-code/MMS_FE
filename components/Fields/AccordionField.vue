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
import { mapGetters } from 'vuex';

export default {
  components: {
    TableField: () => import('./TableField.vue')
  },
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
    isExpanded: false,
    hasLoadedOnce: false
  }),
  computed: {
    ...mapGetters('task/tasks', ['getTasksForStatus', 'isStatusLoading']),

    loadedTasks() {
      // Deep clone hogy ne módosítsuk közvetlenül a store state-t
      const tasks = this.getTasksForStatus(this.statusId);
      return JSON.parse(JSON.stringify(tasks));
    },

    isLoading() {
      return this.isStatusLoading(this.statusId);
    },

    displayCount() {
      if (this.hasLoadedOnce) {
        return this.loadedTasks.length;
      }
      return this.taskCount;
    }
  },
  watch: {
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
      this.$nextTick(() => {
        const willBeExpanded = !this.isExpanded;
        this.isExpanded = willBeExpanded;

        // Always (re)load tasks when the accordion is opened. Do not load on close.
        if (willBeExpanded) {
          this.loadTasksForStatus();
        }
      });
    },

    async loadTasksForStatus() {
      const result = await this.$store.dispatch(
        'task/tasks/fetchTasksByStatus',
        this.statusId
      );

      if (result.success) {
        this.hasLoadedOnce = true;
        this.$emit('tasksLoaded', {
          statusId: this.statusId,
          tasks: this.loadedTasks
        });
      } else {
        this.showNotification('error', result.message);
      }
    },

    async refreshTasks() {
      this.hasLoadedOnce = false;
      if (this.isExpanded) {
        await this.loadTasksForStatus();
      }
    },

    async eventToTask(payload) {
      const column = payload.column;

      // Ha státusz változik, először frissítjük a backend-ben
      if (column === 'status_by_exohu_id') {
        // Először frissítjük a backend-ben
        const result = await this.$store.dispatch('task/tasks/updateTask', {
          ...payload,
          statusId: this.statusId
        });

        if (result.success) {
          // Ha sikeres, jelezzük a szülőnek a mozgatást
          this.$emit('statusChange', {
            taskId: payload.id,
            oldStatusId: this.statusId,
            newStatusId: payload.value,
            color: payload.color,
            status_exohu: payload.status_exohu
          });
        } else {
          this.showNotification('error', result.message);
        }
      } else {
        // Egyéb frissítések a store-on keresztül
        const result = await this.$store.dispatch('task/tasks/updateTask', {
          ...payload,
          statusId: this.statusId
        });

        if (!result.success) {
          this.showNotification('error', result.message);
        }
      }
    },

    async addFee(payload) {
      const result = await this.$store.dispatch('task/tasks/addFee', {
        ...payload,
        statusId: this.statusId
      });

      if (!result.success) {
        this.showNotification('error', result.message);
      }
    },

    async addLocker(payload) {
      const result = await this.$store.dispatch('task/tasks/addLocker', {
        ...payload,
        statusId: this.statusId
      });

      if (result.success) {
        this.showNotification('success', result.data.message);
      } else {
        this.showNotification('error', result.message);
      }
    },

    async removeLocker(payload) {
      const result = await this.$store.dispatch('task/tasks/removeLocker', {
        ...payload,
        statusId: this.statusId
      });

      if (!result.success) {
        this.showNotification('error', result.message);
      }
    },

    async deleteFee(payload) {
      const result = await this.$store.dispatch('task/tasks/deleteFee', {
        ...payload,
        statusId: this.statusId
      });

      if (!result.success) {
        this.showNotification('error', result.message);
      }
    },

    async deletePhoto(payload) {
      this.$store.dispatch('notification/hideModal');

      const result = await this.$store.dispatch('task/tasks/deletePhoto', {
        ...payload,
        statusId: this.statusId
      });

      if (result.success) {
        this.showNotification('success', result.message);
      } else {
        this.showNotification('error', result.message);
      }
    },

    async updateLockerData(payload) {
      const result = await this.$store.dispatch('task/tasks/updateTaskLocker', {
        ...payload,
        statusId: this.statusId
      });

      if (!result.success) {
        this.showNotification('error', result.message);
      }
    },

    bulkUpdateLockerData(data) {
      // Tömeges frissítést továbbra is a szülő koordinálja
      this.$emit('bulkUpdateLockerData', { ...data, statusId: this.statusId });
    },

    downloadTig(data) {
      this.$emit('downloadTig', { ...data, statusId: this.statusId });
    },

    downloadTasks(data) {
      this.$emit('downloadTasks', { ...data, statusId: this.statusId });
    },

    async verifyLocker(payload) {
      const result = await this.$store.dispatch('task/tasks/verifyLocker', {
        statusId: this.statusId,
        taskId: payload.taskId,
        data: payload.data
      });

      if (!result.success) {
        this.showNotification('error', result.message);
      }
    },

    showNotification(type, message) {
      this.$store.dispatch('notification/addNotification', {
        type: type,
        message: message,
        timeout: 5000
      });
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

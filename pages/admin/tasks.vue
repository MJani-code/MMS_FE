<template>
  <div>
    <BounceLoader :loading="isSearchLoading" />
    <div v-if="groupedTasks" class="mt-6">
      <PagesTasksTaskFilter
        :admin-filter-options="adminFilterOptions"
        :serial-filter-options="serialFilterOptions"
        :tasks="[]"
        :download-new-points="downloadNewPoints"
        @uploadBatchTasks="handleUploadBatchTasks"
        @createTask="handleCreateTask"
      />
      <v-expansion-panels v-model="expandedAccordions" multiple>
        <AccordionField
          v-for="(group, statusId) in groupedTasks"
          :key="statusId"
          :ref="'accordion-' + statusId"
          :title="group.title"
          :status-id="statusId"
          :status-color="group.color"
          :server-items-length="
            tasks.serverItemLengthByStatus[statusId]?.count || 0
          "
          :headers="tasks.headers"
          :statuses="tasks.statuses"
          :fees="tasks.fees"
          :allowed-statuses="tasks.allowedStatuses"
          :location-types="tasks.locationTypes"
          :task-types="tasks.taskTypes"
          :responsibles="tasks.responsibles"
          :locker-serials="tasks.lockerSerials"
          :companies="tasks.companies"
          :priorities="tasks.priorities"
        >
        </AccordionField>
      </v-expansion-panels>
    </div>
    <v-sheet v-else>
      <v-card-title class="text-h5">{{ $t('tasks.noData') }}</v-card-title>
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { taskMixin } from '@/mixins/taskMixin.js';
import AccordionField from '../../components/Fields/AccordionField.vue';
import BounceLoader from '@/components/BounceLoader.vue';

export default {
  name: 'AdminTasks',
  components: { AccordionField, BounceLoader },
  mixins: [taskMixin],
  data() {
    return {
      selectedAdminFilter: null,
      selectedSerialFilter: null
    };
  },
  computed: {
    ...mapState('task/tasks', {
      statusGroups: (state) => state.statusGroups,
      storeHeaders: (state) => state.headers,
      storeStatuses: (state) => state.statuses,
      storeFees: (state) => state.fees,
      storeAllowedStatuses: (state) => state.allowedStatuses,
      storeLocationTypes: (state) => state.locationTypes,
      storeTaskTypes: (state) => state.taskTypes,
      storeResponsibles: (state) => state.responsibles,
      storeLockerSerials: (state) => state.lockerSerials,
      storeCompanies: (state) => state.companies,
      storePriorities: (state) => state.priorities,
      serverItemLengthByStatus: (state) => state.serverItemLengthByStatus,
      isSearchLoading: (state) => state.isSearchLoading
    }),

    adminFilterOptions() {
      return [
        { text: this.$t('tasks.filters.allItems'), value: null },
        { text: this.$t('tasks.filters.adminActive'), value: true },
        { text: this.$t('tasks.filters.adminInactive'), value: false }
      ];
    },

    serialFilterOptions() {
      return [
        { text: this.$t('tasks.filters.all'), value: null },
        { text: this.$t('tasks.filters.hasSerial'), value: true },
        { text: this.$t('tasks.filters.noSerial'), value: false }
      ];
    },

    expandedAccordions: {
      get() {
        return this.$store.state.task.tasks.expandedAccordions;
      },
      set(indices) {
        this.$store.commit('task/tasks/SET_EXPANDED_ACCORDIONS', indices);
      }
    },

    groupedTasks() {
      return this.statusGroups;
    },

    tasks() {
      return {
        headers: [...this.storeHeaders],
        statuses: this.storeStatuses,
        fees: this.storeFees,
        allowedStatuses: this.storeAllowedStatuses,
        locationTypes: this.storeLocationTypes,
        taskTypes: this.storeTaskTypes,
        responsibles: this.storeResponsibles,
        lockerSerials: this.storeLockerSerials,
        companies: this.storeCompanies,
        priorities: this.storePriorities,
        serverItemLengthByStatus: this.serverItemLengthByStatus
      };
    }
  },
  watch: {
    async '$i18n.locale'() {
      await this.fetchInitialData();
    }
  },
  async mounted() {
    this.turnOnLoading();
    await this.fetchInitialData();
    this.turnOffLoading();
  },
  methods: {
    async fetchInitialData() {
      const result = await this.$store.dispatch('task/tasks/fetchInitialData');
    },
    turnOnLoading() {
      this.$store.commit('turnOnLoading');
    },
    turnOffLoading() {
      this.$store.commit('turnOffLoading');
    },
    showModal() {
      this.$store.dispatch('notification/showModal', {
        message: this.$t('tasks.deleteConfirm'),
        buttons: [
          { text: this.$t('common.yes'), style: 'primary', action: '' },
          {
            text: this.$t('common.cancel'),
            style: 'secondary',
            action: () => this.$store.dispatch('notification/hideModal')
          }
        ]
      });
    },
    async handleUploadBatchTasks(payload) {
      try {
        const result = await this.$store.dispatch(
          'task/tasks/createTaskBatch',
          payload
        );

        if (result.success) {
          this.showNotification('success', result.message);
        } else {
          this.showNotification('error', result.message);
        }
      } catch (error) {
        this.showNotification('error', error.message || error);
      }

      this.$store.commit('closeCreateTaskBatchModal');
      this.turnOffLoading();
    },
    async handleCreateTask(payload) {
      try {
        const result = await this.$store.dispatch(
          'task/tasks/createTask',
          payload
        );

        if (result.success) {
          this.showNotification('success', result.message);
        } else {
          this.showNotification('error', result.message);
        }
      } catch (error) {
        this.showNotification('error', error.message || error);
      }

      this.$store.commit('closeCreateTaskModal');
      this.turnOffLoading();
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

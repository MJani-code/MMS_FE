<template>
  <div v-if="groupedTasks" class="mt-6">
    <PagesTasksTaskFilter
      :admin-filter-options="adminFilterOptions"
      :serial-filter-options="serialFilterOptions"
      :tasks="[]"
      :download-new-points="downloadNewPoints"
      @searchedValue="filteredTasks"
      @tofShopIdFilter="filteredTasks"
      @serialFilter="filteredTasks"
      @createTask="handleCreateTask"
      @uploadBatchTasks="handleUploadBatchTasks"
    />
    <v-expansion-panels v-model="expandedAccordions" multiple>
      <AccordionField
        v-for="(group, statusId) in groupedTasks"
        :key="statusId"
        :ref="'accordion-' + statusId"
        :title="group.title"
        :status-id="statusId"
        :status-color="group.color"
        :task-count="group.count"
        :headers="tasks.headers"
        :statuses="tasks.statuses"
        :fees="tasks.fees"
        :allowed-statuses="tasks.allowedStatuses"
        :location-types="tasks.locationTypes"
        :task-types="tasks.taskTypes"
        :locker-serials="tasks.lockerSerials"
        :companies="tasks.companies"
        :priorities="tasks.priorities"
        @tasksLoaded="handleTasksLoaded"
        @countChanged="handleCountChanged"
        @statusChange="handleStatusChange"
        @bulkUpdateLockerData="handleBulkUpdateLockerData"
        @downloadTig="handleDownloadTig"
        @downloadTasks="handleDownloadTasks"
      >
      </AccordionField>
    </v-expansion-panels>
  </div>
  <v-sheet v-else>
    <v-card-title class="text-h5">Nincs megjeleníthető adat</v-card-title>
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import { taskMixin } from '@/mixins/taskMixin.js';
import AccordionField from '../../components/Fields/AccordionField.vue';

export default {
  name: 'AdminTasks',
  components: { AccordionField },
  mixins: [taskMixin],
  data() {
    return {
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
      expandedAccordions: []
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
      storeLockerSerials: (state) => state.lockerSerials,
      storeCompanies: (state) => state.companies,
      storePriorities: (state) => state.priorities
    }),

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
        lockerSerials: this.storeLockerSerials,
        companies: this.storeCompanies,
        priorities: this.storePriorities
      };
    }
  },
  async mounted() {
    this.turnOnLoading();
    await this.getTaskStatuses();
    this.turnOffLoading();
  },
  methods: {
    async getTaskStatuses() {
      const result = await this.$store.dispatch('task/tasks/fetchTaskStatuses');

      if (result.success) {
        // Headers unshift kell
        this.$store.commit('task/tasks/SET_META_DATA', {
          ...this.$store.state.task.tasks,
          headers: [
            { text: '', value: 'data-table-expand' },
            ...this.$store.state.task.tasks.headers
          ]
        });
      } else {
        this.showNotification('error', result.message);
      }
    },

    handleTasksLoaded(payload) {
      // Info célból, ha szükséges
    },

    handleCountChanged(payload) {
      const { statusId, count } = payload;
      this.$store.commit('task/tasks/UPDATE_STATUS_COUNT', { statusId, count });
    },
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
          await this.refreshStatusGroups();
          // Frissítjük a nyitott accordion-okat is
          this.refreshOpenAccordions();
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
          await this.refreshStatusGroups();
          // Frissítjük a nyitott accordion-okat is
          this.refreshOpenAccordions();
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
    refreshOpenAccordions() {
      Object.keys(this.$refs).forEach((refKey) => {
        if (refKey.startsWith('accordion-')) {
          const accordionRef = this.$refs[refKey];
          if (accordionRef && accordionRef[0] && accordionRef[0].isExpanded) {
            accordionRef[0].refreshTasks();
          }
        }
      });
    },

    async handleStatusChange(payload) {
      const { taskId, oldStatusId, newStatusId, color, status_exohu } = payload;

      // Megkeressük a task-ot a store-ban
      const tasks =
        this.$store.state.task.tasks.tasksByStatus[oldStatusId] || [];
      const task = tasks.find((t) => t.id === taskId);

      if (task) {
        // Frissítjük a task adatait
        const updatedTask = {
          ...task,
          status_exohu_id: newStatusId,
          status_color: color,
          status_exohu: status_exohu
        };

        // Store mutation-nel mozgatjuk a task-ot (ez frissíti a számlálókat is)
        this.$store.commit('task/tasks/MOVE_TASK_TO_STATUS', {
          taskId,
          fromStatusId: oldStatusId,
          toStatusId: newStatusId,
          updatedTask
        });

        // Ha az új accordion már be van töltve, frissítjük
        this.$nextTick(() => {
          const newAccordionRef = this.$refs[`accordion-${newStatusId}`];
          if (newAccordionRef && newAccordionRef[0]) {
            const newAccordion = newAccordionRef[0];
            if (newAccordion.isExpanded && newAccordion.hasLoadedOnce) {
              newAccordion.refreshTasks();
            }
          }
        });
      }
    },

    async handleBulkUpdateLockerData(payload) {
      const taskIds = payload.taskIds;
      const column = payload.column;
      const value = payload.value;
      const oldStatusId = payload.statusId;

      // Ha státusz változott tömeges művelettel
      if (column == 'status_by_exohu_id' && oldStatusId !== value) {
        // Store-ban eltávolítjuk a taskokat (ez frissíti a számlálót is)
        this.$store.commit('task/tasks/REMOVE_TASKS_FROM_STATUS', {
          statusId: oldStatusId,
          taskIds: taskIds
        });

        // Frissítjük az új státuszú accordion-t ha már be van töltve
        this.$nextTick(() => {
          const newAccordionRef = this.$refs[`accordion-${value}`];
          if (newAccordionRef && newAccordionRef[0]) {
            const newAccordion = newAccordionRef[0];
            if (newAccordion.isExpanded && newAccordion.hasLoadedOnce) {
              newAccordion.refreshTasks();
            }
          }
        });
      }
    },

    async handleDownloadTig(payload) {
      try {
        const response = await this.downloadTig(payload);

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tig.xlsx');
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

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'completedtasks.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        this.showNotification('error', error);
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

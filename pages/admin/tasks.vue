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
        fees: [],
        taskTypes: [],
        lockerSerials: [],
        companies: [],
        priorities: [],
        allowedStatuses: []
      },
      statusGroups: [], // Státusz csoportok darabszámmal
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
      return this.statusGroups;
    }
  },
  async mounted() {
    this.turnOnLoading();
    await this.getTaskStatuses();
    this.turnOffLoading();
  },
  methods: {
    async getTaskStatuses() {
      try {
        const result = await this.fetchTaskStatuses();

        if (result.data.status === 200) {
          const payload = result.data.payload;

          // Meta adatok
          this.tasks.headers = payload.headers || [];
          this.tasks.statuses = payload.statuses || [];
          this.tasks.fees = payload.fees || [];
          this.tasks.allowedStatuses = payload.allowedStatuses || [];
          this.tasks.locationTypes = payload.locationTypes || [];
          this.tasks.taskTypes = payload.taskTypes || [];
          this.tasks.lockerSerials = payload.lockerSerials || [];
          this.tasks.companies = payload.companies || [];
          this.tasks.priorities = payload.priorities || [];
          this.tasks.headers.unshift({ text: '', value: 'data-table-expand' });

          // Státusz csoportok darabszámokkal
          this.statusGroups = payload.statusGroups || {};
        } else {
          this.showNotification('error', result.data.message || 'Hiba történt');
        }
      } catch (error) {
        console.error('Error fetching statuses:', error);
        this.showNotification(
          'error',
          'Hiba történt a státuszok betöltése során'
        );
      }
    },
    handleTasksLoaded(payload) {
      // Ha szükséges, itt további műveleteket végezhetünk
      // amikor egy accordion betöltötte az adatait
      const { statusId, tasks } = payload;
    },
    handleCountChanged(payload) {
      // Frissítjük a statusGroups count értékét amikor egy accordion számlálója változik
      const { statusId, count } = payload;
      if (this.statusGroups[statusId]) {
        this.statusGroups[statusId].count = count;
      }
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
      // Frissítjük az összes megnyitott accordion-t
      Object.keys(this.$refs).forEach((refKey) => {
        if (refKey.startsWith('accordion-')) {
          const accordionRef = this.$refs[refKey];
          if (accordionRef && accordionRef[0] && accordionRef[0].isExpanded) {
            accordionRef[0].refreshTasks();
          }
        }
      });
    },
    async handleUpdatedLockerData(payload) {
      const result = await this.updateTask(payload);
      if (result.data.status === 200) {
        const newValue = result.data.payload.value;
        const lockerId = result.data.payload.id;
        const column = result.data.payload.column;
        const taskId = result.data.payload.taskId;

        this.refreshAccordionTask(payload.statusId, (task) => {
          if (task.id === taskId) {
            const locker = task.lockers.find((item) => item.id === lockerId);
            if (locker) {
              locker[column] = newValue;
              return true;
            }
          }
          return false;
        });
      } else {
        this.showNotification('error', result.data.message);
      }
    },
    async handleBulkUpdateLockerData(payload) {
      const taskIds = payload.taskIds;
      const column = payload.column;
      const value = payload.value;
      const color = payload.color;
      const oldStatusId = payload.statusId;

      // Frissítjük az adott accordion task-jait
      this.refreshAccordionTask(payload.statusId, (task) => {
        if (taskIds.includes(task.id)) {
          task[column] = value;
          if (column == 'status_by_exohu_id') {
            task.status_color = color;
            task.status_exohu = payload.status_exohu;
            task.status_exohu_id = value;
          }
          return true;
        }
        return false;
      });

      // Ha státusz változott tömeges művelettel
      if (column == 'status_by_exohu_id' && oldStatusId !== value) {
        // Eltávolítjuk a taskokat a régi státuszú accordion-ból
        const oldAccordionRef = this.$refs[`accordion-${oldStatusId}`];
        if (oldAccordionRef && oldAccordionRef[0]) {
          const oldAccordion = oldAccordionRef[0];
          oldAccordion.loadedTasks = oldAccordion.loadedTasks.filter(
            (task) => !taskIds.includes(task.id)
          );
        }

        await this.refreshStatusGroups();

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
    async handleUpdatedTask(payload) {
      const result = await this.updateTask(payload);
      const isPhotoUpload = result.data.payload?.photoUpload;
      const color = payload.color;

      if (result.data.status === 200 && isPhotoUpload) {
        const locationId = result.data.payload.locationId;
        const newUrl = result.data.payload.url;
        // Frissítjük az adott accordion task-jait
        this.refreshAccordionTask(payload.statusId, (task) => {
          if (task.location_id === locationId) {
            task.location_photos.push({ url: newUrl });
            return true;
          }
          return false;
        });
      }
      if (result.data.status === 200 && !isPhotoUpload) {
        if (payload.dbTable === 'task_locations') {
          const locationId = result.data.payload.id;
          const column = result.data.payload.column;
          const newValue = result.data.payload.value;
          this.refreshAccordionTask(payload.statusId, (task) => {
            if (task.location_id === locationId) {
              task[column] = newValue;
              return true;
            }
            return false;
          });
        } else {
          const taskId = result.data.payload.id;
          const column = result.data.payload.column;
          const newValue = result.data.payload.value;

          // Ha státusz változás
          if (column == 'status_by_exohu_id') {
            // Megkeressük a task-ot a régi accordion-ban
            const oldAccordionRef = this.$refs[`accordion-${payload.statusId}`];
            let taskToMove = null;

            if (oldAccordionRef && oldAccordionRef[0]) {
              const oldAccordion = oldAccordionRef[0];
              taskToMove = oldAccordion.loadedTasks.find(
                (t) => t.id === taskId
              );

              if (taskToMove) {
                // Frissítjük a task státuszát
                taskToMove.status_exohu_id = newValue;
                taskToMove.status_color = color;
                taskToMove.status_exohu = payload.status_exohu;

                // Eltávolítjuk a régi helyről
                oldAccordion.loadedTasks = oldAccordion.loadedTasks.filter(
                  (task) => task.id !== taskId
                );

                console.log(
                  `Task ${taskId} removed from status ${payload.statusId}, moving to ${newValue}`
                );
              }
            }

            // Frissítjük a státusz csoportokat
            await this.refreshStatusGroups();

            // Ha az új státuszú accordion már be van töltve, hozzáadjuk ott
            this.$nextTick(() => {
              const newAccordionRef = this.$refs[`accordion-${newValue}`];
              if (newAccordionRef && newAccordionRef[0]) {
                const newAccordion = newAccordionRef[0];
                if (
                  newAccordion.isExpanded &&
                  newAccordion.hasLoadedOnce &&
                  taskToMove
                ) {
                  // Hozzáadjuk az új accordion-hoz
                  newAccordion.loadedTasks.unshift(taskToMove);
                  console.log(`Task ${taskId} added to status ${newValue}`);
                }
              }
            });
          } else {
            // Nem státusz változás, csak egyszerű frissítés
            this.refreshAccordionTask(payload.statusId, (task) => {
              if (task.id === taskId) {
                task[column] = newValue;
                return true;
              }
              return false;
            });
          }
        }
      }
      if (result.data.status !== 200) {
        this.showNotification('error', result.data.message);
      }
    },
    refreshAccordionTask(statusId, updateFn) {
      // Megkeressük az adott státuszú accordion-t és frissítjük a task-jait
      const accordionRef = this.$refs[`accordion-${statusId}`];
      if (accordionRef && accordionRef[0]) {
        const accordion = accordionRef[0];
        const updatedTasks = accordion.loadedTasks.map((task) => {
          if (updateFn(task)) {
            return { ...task };
          }
          return task;
        });
        accordion.loadedTasks = updatedTasks;
      }
    },
    async refreshStatusGroups() {
      // Újratöltjük a státusz csoportokat (darabszámok frissítése)
      await this.getTaskStatuses();
    },
    async handleStatusChange(taskId, oldStatusId, newStatusId) {
      // Task státusza megváltozott
      console.log(
        `Task ${taskId} moved from status ${oldStatusId} to ${newStatusId}`
      );

      // 1. Eltávolítjuk a taskot a régi státuszú accordion-ból
      const oldAccordionRef = this.$refs[`accordion-${oldStatusId}`];
      if (oldAccordionRef && oldAccordionRef[0]) {
        const oldAccordion = oldAccordionRef[0];
        oldAccordion.loadedTasks = oldAccordion.loadedTasks.filter(
          (task) => task.id !== taskId
        );
      }

      // 2. Frissítjük a státusz csoportokat (darabszámok)
      await this.refreshStatusGroups();

      // 3. Ha az új státuszú accordion már be van töltve, frissítjük
      this.$nextTick(() => {
        const newAccordionRef = this.$refs[`accordion-${newStatusId}`];
        if (newAccordionRef && newAccordionRef[0]) {
          const newAccordion = newAccordionRef[0];
          // Ha már meg van nyitva és be van töltve, frissítjük
          if (newAccordion.isExpanded && newAccordion.hasLoadedOnce) {
            newAccordion.refreshTasks();
          }
        }
      });
    },
    async handleAddFee(payload) {
      const result = await this.addFee(payload);

      if (result.data.status === 200) {
        const taskId = result.data.payload.taskId;
        const newFee = result.data.payload;

        this.refreshAccordionTask(payload.statusId, (task) => {
          if (task.id === taskId) {
            if (!task.taskFees) task.taskFees = [];
            task.taskFees.push(newFee);
            return true;
          }
          return false;
        });
      }
    },
    async handleAddLocker(payload) {
      const result = await this.addLocker(payload);
      const message = result.data.message;

      if (result.data.status === 200) {
        const taskId = result.data.payload[0].taskId;
        const lockers = result.data.payload;

        this.refreshAccordionTask(payload.statusId, (task) => {
          if (task.id === taskId) {
            task.lockers = lockers;
            return true;
          }
          return false;
        });
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
        this.refreshAccordionTask(payload.statusId, (task) => {
          const index = task.lockers.findIndex(
            (locker) => locker.id === payload.id
          );
          if (index !== -1) {
            task.lockers.splice(index, 1);
            return true;
          }
          return false;
        });
      }
    },
    async handleDeleteFee(payload) {
      const result = await this.deleteFee(payload);
      if (result.data.status === 200) {
        const idToRemove = result.data.payload.id;
        const taskIdToRemove = result.data.payload.taskId;

        this.refreshAccordionTask(payload.statusId, (task) => {
          if (
            task.taskFees &&
            task.taskFees.some(
              (fee) => fee.id === idToRemove && fee.taskId === taskIdToRemove
            )
          ) {
            task.taskFees = task.taskFees.filter(
              (fee) => !(fee.id === idToRemove && fee.taskId === taskIdToRemove)
            );
            return true;
          }
          return false;
        });
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

        this.refreshAccordionTask(payload.statusId, (task) => {
          if (task.location_id === taskLocationsId) {
            const photoIndex = task.location_photos.findIndex(
              (item) => item.url === photoUrl
            );
            if (photoIndex !== -1) {
              task.location_photos.splice(photoIndex, 1);
              this.showNotification('success', result.data.message);
              return true;
            }
          }
          return false;
        });
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

        this.refreshAccordionTask(payload.statusId, (task) => {
          if (task.id === taskId) {
            const lockerIndex = task.lockers.findIndex(
              (item) => item.id === lockerId
            );
            if (lockerIndex !== -1) {
              task.lockers[lockerIndex] = result.data.payload;
              return true;
            }
          }
          return false;
        });
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

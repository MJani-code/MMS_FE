// prettier-ignore
import {
  APIGET,
  APIPOST,
  APIPOST2,
  APIDOWNLOAD
} from '~/api/apiHelper';

export const taskMixin = {
  methods: {
    getActiveLocale() {
      if (this.$i18n && this.$i18n.locale) {
        return this.$i18n.locale;
      }
      if (this.$store && this.$store.state && this.$store.state.locale) {
        return this.$store.state.locale;
      }
      if (typeof window !== 'undefined') {
        const appLocale = localStorage.getItem('appLocale');
        if (appLocale) return appLocale;
        const storedData = localStorage.getItem('data');
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            if (parsed && parsed.locale) return parsed.locale;
          } catch (_error) {}
        }
      }
      return 'hu';
    },
    addLocaleToPayload(payload) {
      if (payload instanceof FormData) {
        if (!payload.has('locale')) payload.append('locale', this.getActiveLocale());
        return payload;
      }
      if (payload && typeof payload === 'object') {
        if (!payload.locale) payload.locale = this.getActiveLocale();
        return payload;
      }
      return { locale: this.getActiveLocale() };
    },
    showNotification($type, $message) {
      this.$store.dispatch('notification/addNotification', {
        type: $type,
        message: $message,
        timeout: 5000
      });
    },
    async fetchTasks() {
      try {
        const token = this.$store.state.token;
        const response = await APIGET('getAllTask', { locale: this.getActiveLocale() }, token);
        return await response;
      } catch (error) {
        console.error('Error fetching tasks', error);
        return [];
      }
    },
    async fetchTaskStatuses() {
      try {
        const token = this.$store.state.token;
        const response = await APIGET('getTaskStatuses', {}, token);
        return await response;
      } catch (error) {
        console.error('Error fetching task statuses', error);
        return [];
      }
    },
    // async fetchTasksByStatus(statusId, page, itemsPerPage) {
    //   try {
    //     const token = this.$store.state.token;
    //     const response = await APIGET(
    //       'getTasksByStatus',
    //       { statusId, page, itemsPerPage },
    //       token
    //     );
    //     return await response;
    //   } catch (error) {
    //     console.error('Error fetching tasks by status', error);
    //     return [];
    //   }
    // },
    async fetchDirect4MeLocations() {
      try {
        const token = this.$store.state.token;
        const response = await APIGET(
          'Locations_GetCountryPublicLocations',
          {},
          token
        );
        return await response;
      } catch (error) {
        console.error('Error fetching d4me locations', error);
        return [];
      }
    },
    updateTask(payload) {
      if (payload.file) {
        try {
          const token = this.$store.state.token;
          const response = APIPOST2('uploadMedia', payload, token);
          return response;
        } catch (error) {
          console.error('Error fetching updated tasks', error);
          return [];
        }
      }
      try {
        const token = this.$store.state.token;
        const response = APIPOST('updateTask', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching updated tasks', error);
        return [];
      }
    },
    addFee(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST('addFee', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching Fees', error);
        return [];
      }
    },
    addLocker(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST('addLocker', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching Lockers', error);
        return [];
      }
    },
    deleteFee(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST('deleteFee', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching Fees', error);
        return [];
      }
    },
    removeLocker(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST('removeLocker', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching removed lockers', error);
        return [];
      }
    },
    getUser() {
      try {
        const token = this.$store.state.token;
        const response = APIGET('getUser', {}, token);
        return response;
      } catch (error) {
        console.error('Error fetching users', error);
        return [];
      }
    },
    updateUser(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST('updateUser', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching updated users', error);
        return [];
      }
    },
    uploadBatchTasks(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST2('createTaskBatch', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching batch tasks', error);
        return [];
      }
    },
    downloadTig(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIDOWNLOAD('downloadTig', token);
        return response;
      } catch (error) {
        console.error('Error fetching TIG', error);
        return [];
      }
    },
    downloadTasks(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIDOWNLOAD('downloadTasks', token);
        return response;
      } catch (error) {
        console.error('Error fetching task for download', error);
        return [];
      }
    },
    verifyLocker(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST('verifyLocker', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching locker verification', error);
        return [];
      }
    },
    getLockerDataFromLos(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST('getLockerFromLos', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching locker data from LOS', error);
        return [];
      }
    },
    getDataForCreateTask(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST('getDataForCreateTask', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching task creation data', error);
        return [];
      }
    },
    createTask(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST('createTask', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching task creation data', error);
        return [];
      }
    },
    deletePhoto(payload) {
      try {
        const token = this.$store.state.token;
        const response = APIPOST('deleteMedia', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching deleted photos', error);
        return [];
      }
    },
    async fetchIssues(payload, token) {
      try {
        const response = await APIPOST('getTaskLockersIssues', payload, token);
        return await response;
      } catch (error) {
        console.error('Error fetching issues', error);
        return [];
      }
    },
    async downloadNewPoints(payload, token) {
      try {
        const response = await APIPOST(
          'downloadNewPoints',
          payload,
          token,
          true
        );
        return await response;
      } catch (error) {
        console.error('Error fetching new points', error);
        return [];
      }
    },
    async downloadNotifications(params) {
      try {
        const token = this.$store.state.token;
        const response = await APIGET('downloadNotifications', params, token);
        return await response;
      } catch (error) {
        console.error('Error fetching notifications', error);
        return [];
      }
    },
    async markNotificationsAsRead(payload) {
      try {
        const token = this.$store.state.token;
        const response = await APIPOST('readNotifications', payload, token);
        return response;
      } catch (error) {
        console.error('Error marking notifications as read', error);
        return [];
      }
    },
    async addIntervention(taskId, interventionData, token) {
      try {
        const response = await APIPOST(
          'addIntervention',
          { taskId: taskId, interventions: [interventionData] },
          token
        );
        return response;
      } catch (error) {
        console.error('Error adding intervention', error);
        return [];
      }
    },
    async deleteIntervention(data, token) {
      try {
        const response = await APIPOST('deleteIntervention', data, token);
        return response;
      } catch (error) {
        console.error('Error deleting intervention', error);
        return [];
      }
    },
    getStockItems(token) {
      try {
        const response = APIGET('getStockItems', null, token);
        return response;
      } catch (error) {
        console.error('Error fetching stock items', error);
        return [];
      }
    },
    getPartsMasterData(token) {
      try {
        const response = APIGET('getPartsMasterData', null, token);
        return response;
      } catch (error) {
        console.error('Error fetching parts master data', error);
        return [];
      }
    },
    async addStockItem(token, item) {
      try {
        const response = await APIPOST('addPartToStock', item, token);
        return response;
      } catch (error) {
        console.error('Error adding stock item', error);
        return [];
      }
    },
    async updateStockItem(token, item) {
      try {
        const response = await APIPOST('updatePartInStock', item, token);
        return response;
      } catch (error) {
        console.error('Error updating stock item', error);
        return [];
      }
    },
    async getPartsHistory(token, data) {
      try {
        const response = await APIPOST('getPartsHistory', data, token);
        return response;
      } catch (error) {
        console.error('Error fetching parts history', error);
        return [];
      }
    },
    async updateTaskInBatch(token, data) {
      try {
        const response = await APIPOST('updateTaskInBatch', data, token);
        return response;
      } catch (error) {
        console.error('Error updating tasks in batch', error);
        return [];
      }
    }
    // async getFilteredTasks(token, filters) {
    //   try {
    //     const response = await APIPOST('filterTasks', filters, token);
    //     return response;
    //   } catch (error) {
    //     console.error('Error fetching filtered tasks', error);
    //     return [];
    //   }
    // }
  }
};

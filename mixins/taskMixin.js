// prettier-ignore
import {
  APIGET,
  APIPOST,
  APIPOST2,
  APIDOWNLOAD
} from '~/api/apiHelper';

export const taskMixin = {
  methods: {
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
        const response = await APIGET('getAllTask', {}, token);
        return await response;
      } catch (error) {
        console.error('Error fetching tasks', error);
        return [];
      }
    },
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
          const response = APIPOST2('updateTask', payload, token);
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
        const response = APIPOST('deletePhoto', payload, token);
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
    }
  }
};

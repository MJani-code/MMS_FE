// prettier-ignore
import {
  APIGET,
  APIPOST,
  APIPOST2
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
        const response = await APIGET('getAllTask', token);
        return await response;
      } catch (error) {
        console.error('Error fetching users', error);
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
          console.error('Error fetching users', error);
          return [];
        }
      }
      try {
        const token = this.$store.state.token;
        const response = APIPOST('updateTask', payload, token);
        return response;
      } catch (error) {
        console.error('Error fetching users', error);
        return [];
      }
    },
    addFee(payload) {
      try {
        const response = APIPOST('addFee', payload);
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
        console.error('Error fetching users', error);
        return [];
      }
    },
    getUser() {
      try {
        const token = this.$store.state.token;
        const response = APIGET('getUser', token);
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
        console.error('Error fetching users', error);
        return [];
      }
    }
  }
};

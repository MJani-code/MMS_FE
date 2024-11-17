// prettier-ignore
import {
  APIGET,
  APIPOST,
  APIPOST2
} from '~/api/apiHelper';

export const taskMixin = {
  methods: {
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
          const response = APIPOST2('updateTask', payload, 'token');
          return response;
        } catch (error) {
          console.error('Error fetching users', error);
          return [];
        }
      }
      try {
        const response = APIPOST('updateTask', payload);
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
        console.error('Error fetching users', error);
        return [];
      }
    },
    deleteFee(payload) {
      try {
        const response = APIPOST('deleteFee', payload);
        return response;
      } catch (error) {
        console.error('Error fetching users', error);
        return [];
      }
    }
  }
};

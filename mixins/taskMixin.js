// prettier-ignore
import {
  APIGET,
  APIPOST2
} from '~/api/apiHelper';

export const taskMixin = {
  methods: {
    async fetchTasks() {
      try {
        const response = await APIGET('getAllTask');
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
        const response = APIPOST2('updateTask', payload);
        return response;
      } catch (error) {
        console.error('Error fetching users', error);
        return [];
      }
    }
  }
};

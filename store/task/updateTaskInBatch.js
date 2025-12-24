import { taskMixin } from '@/mixins/taskMixin.js';

export const actions = {
  async updateTask({ commit, rootState }, data) {
    const token = rootState.token;
    const res = await taskMixin.methods.updateTaskInBatch(token, data);
    return res.data;
  }
};

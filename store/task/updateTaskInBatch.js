import { taskMixin } from '@/mixins/taskMixin.js';

export const actions = {
  async updateTask({ commit, rootState, dispatch }, data) {
    const token = rootState.token;
    const res = await taskMixin.methods.updateTaskInBatch(token, data);

    return res.data;
  }
};

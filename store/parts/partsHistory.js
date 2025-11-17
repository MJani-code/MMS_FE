import { taskMixin } from '@/mixins/taskMixin.js';

export const state = () => ({
  PartsHistory: []
});

export const mutations = {
  setPartsHistory(state, partsHistory) {
    state.PartsHistory = partsHistory;
  }
};

export const actions = {
  async fetchPartsHistory({ commit, rootState }, data) {
    const token = rootState.token;
    const res = await taskMixin.methods.getPartsHistory(token, data);
    commit('setPartsHistory', res.data.payload);
    return res.data.payload;
  }
};

export const getters = {
  getPartsHistory(state) {
    return state.PartsHistory;
  }
};

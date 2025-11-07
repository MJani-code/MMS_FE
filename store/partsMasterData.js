import { taskMixin } from '@/mixins/taskMixin.js';

export const state = () => ({
  masterData: []
});

export const mutations = {
  setMasterData(state, masterData) {
    state.masterData = masterData;
  }
};

export const actions = {
  async fetchMasterData({ commit, rootState }) {
    const token = rootState.token;
    const res = await taskMixin.methods.getPartsMasterData(token);
    commit('setMasterData', res.data.payload);
    return res.data.payload;
  }
};

export const getters = {
  getMasterData(state) {
    return state.masterData;
  }
};

import { taskMixin } from '@/mixins/taskMixin.js';

export const state = () => ({
  issues: [],
  interventions: [],
  loading: false,
  successMessage: '',
  errorMessage: ''
});

export const mutations = {
  setIssue(state, issues) {
    state.issues = issues;
  },
  setIntervention(state, interventions) {
    state.interventions = interventions;
  }
};

export const actions = {
  async fetchIssuesAction({ commit }, payload) {
    const res = await taskMixin.methods.fetchIssues(payload);
    commit('setIssue', res.data.payload);
  },
  async addIntervention({ commit }, payload) {
    const res = await taskMixin.methods.addIntervention(payload);
    commit('setIntervention', res.data.payload);
  }
};

export const getters = {
  getIssues(state) {
    return state.issues;
  },
  getInterventions(state) {
    return state.interventions;
  }
};

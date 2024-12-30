export const state = () => ({
  selectedLocker: null
});

export const mutations = {
  setSelectedLocker(state, locker) {
    state.selectedLocker = locker;
  }
};

export const actions = {
  setSelectedLocker({ commit }, locker) {
    commit('setSelectedLocker', locker);
  }
};

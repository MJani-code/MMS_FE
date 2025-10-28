/*prettier-ignore*/
export const state = () => ({
  notifications: [],
  modal: {
    visible: false,
    message: '',
    buttons: []
  },
  bellEvent: null
});

export const mutations = {
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push(notification);
  },
  REMOVE_NOTIFICATION(state, index) {
    state.notifications.splice(index, 1);
  },
  SHOW_MODAL(state, modalData) {
    state.modal = {
      ...modalData,
      visible: true
    };
  },
  HIDE_MODAL(state) {
    state.modal.visible = false;
  },
  setBellEvent(state, payload) {
    state.bellEvent = payload ? { ...payload, _ts: Date.now() } : null;
  }
};

/*prettier-ignore*/
export const actions = {
  addNotification({
    commit
  }, notification) {
    commit("ADD_NOTIFICATION", notification);
    setTimeout(() => {
      commit("REMOVE_NOTIFICATION", 0);
    }, notification.timeout || 3000);
  },
  showModal({
    commit
  }, modalData) {
    commit("SHOW_MODAL", modalData);
  },
  hideModal({
    commit
  }) {
    commit("HIDE_MODAL");
  },
  triggerBellEvent({ commit }, payload) {
    commit('setBellEvent', payload);
  }
};

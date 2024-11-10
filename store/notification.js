/*prettier-ignore*/
export const state = () => ({
  notifications: []
});

export const mutations = {
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push(notification);
  },
  REMOVE_NOTIFICATION(state, index) {
    state.notifications.splice(index, 1);
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
};

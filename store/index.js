// store/index.js
export const state = () => ({
  token: null,
  roleId: null,
  userId: null,
  email: '',
  firstName: '',
  permissions: [],
  loading: false,
  isModalCreateTaskBatchOpen: false,
  isModalCreateTaskOpen: false
});

export const mutations = {
  setToken(state, response) {
    const jsonData = JSON.stringify(response);
    state.token = response.data.token;
    state.firstName = response.data.firstName;
    state.roleId = response.data.roleId;
    state.userId = response.data.userId;
    state.email = response.data.email;
    state.permissions = response.data.xtg;
    localStorage.setItem('data', jsonData); // opcionális: token tárolása localStorage-ban
  },
  clearToken(state) {
    state.token = null;
    localStorage.removeItem('data');
  },
  turnOnLoading(state) {
    state.loading = true;
  },
  turnOffLoading(state) {
    state.loading = false;
  },
  openCreateTaskBatchModal(state) {
    state.isModalCreateTaskBatchOpen = true;
  },
  closeCreateTaskBatchModal(state) {
    state.isModalCreateTaskBatchOpen = false;
  },
  openCreateTaskModal(state) {
    state.isModalCreateTaskOpen = true;
  },
  closeCreateTaskModal(state) {
    state.isModalCreateTaskOpen = false;
  }
};

export const getters = {
  hasPermission: (state) => (permission) => {
    return state.permissions.includes(permission);
  }
};

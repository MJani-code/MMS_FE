// store/index.js
export const state = () => ({
  token: null,
  roleId: null,
  userId: null,
  locale: 'hu',
  email: '',
  firstName: '',
  permissions: [],
  loading: false,
  isModalCreateTaskBatchOpen: false,
  isModalCreateTaskOpen: false
});

export const mutations = {
  setToken(state, response) {
    const persistedLocale =
      response.locale ||
      state.locale ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('appLocale')
        : null) ||
      'hu';
    const responseWithLocale = {
      ...response,
      locale: persistedLocale
    };

    state.token = response.data.token;
    state.firstName = response.data.firstName;
    state.roleId = response.data.roleId;
    state.userId = response.data.userId;
    state.email = response.data.email;
    state.permissions = response.data.xtg;
    state.locale = persistedLocale;

    if (typeof window !== 'undefined') {
      localStorage.setItem('data', JSON.stringify(responseWithLocale));
      localStorage.removeItem('appLocale');
    }
  },
  clearToken(state) {
    state.token = null;
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLocale', state.locale || 'hu');
      localStorage.removeItem('data');
    }
  },
  setLocale(state, locale) {
    state.locale = locale;

    if (typeof window === 'undefined') {
      return;
    }

    const storedData = localStorage.getItem('data');
    if (!storedData) {
      localStorage.setItem('appLocale', locale);
      return;
    }

    try {
      const parsed = JSON.parse(storedData);
      parsed.locale = locale;
      localStorage.setItem('data', JSON.stringify(parsed));
    } catch (_error) {
      localStorage.setItem('appLocale', locale);
    }
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

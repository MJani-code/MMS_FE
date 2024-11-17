// store/index.js
export const state = () => ({
  token: null,
  roleId: null,
  userId: null,
  email: '',
  firstName: ''
});

export const mutations = {
  setToken(state, response) {
    const jsonData = JSON.stringify(response);
    state.token = response.data.token;
    state.firstName = response.data.firstName;
    state.roleId = response.data.roleId;
    state.userId = response.data.userId;
    state.email = response.data.email;
    localStorage.setItem('data', jsonData); // opcionális: token tárolása localStorage-ban
  },
  clearToken(state) {
    state.token = null;
    localStorage.removeItem('data');
  }
};

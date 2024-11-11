// store/index.js
export const state = () => ({
  token: null
});

export const mutations = {
  setToken(state, response) {
    const jsonData = JSON.stringify(response);
    state.token = response.data.token;
    state.firstName = response.data.firstName;
    localStorage.setItem('data', jsonData); // opcionális: token tárolása localStorage-ban
  },
  clearToken(state) {
    state.token = null;
    localStorage.removeItem('data');
  }
};

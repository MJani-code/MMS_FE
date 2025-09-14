// prettier-ignore
import {
  APIPOST
} from "~/api/apiHelper";

// prettier-ignore
export default async function ({
  store,
  redirect,
  error,
  route
}) {

  if (route.path === '/') {
    return;
  }
  // Adatok lekérése a localStorage-ból
  const dataFromLocalStorage = localStorage.getItem('data');
  const parsedData = dataFromLocalStorage ? JSON.parse(dataFromLocalStorage) : null;

  if (parsedData) {

    if (parsedData?.data.isLoggedIn) {
      const token = parsedData.data.token;
      const roleId = parsedData.data.roleId;
      const userId = parsedData.data.userId;
      const email = parsedData.data.email;

      if (store.state.token === null) {
        store.commit('setToken', parsedData);
      }

      try {
        // Token validálása a backenddel
        if (token) {
          const response = await APIPOST('auth', {
            token: token,
            urlTo: route.path
          });
          if (response.data.status === 401 || response.data.status === 400) {
            //localStorage.removeItem('data'); // lejárt token törlése
            return redirect('/');
          }
        }

      } catch (err) {
        // Ha hiba történt a backend kérés közben, naplózzuk, és átirányítunk
        console.error("Token validálási hiba:", err);
        if (err.response.status === 404) {
          error({ statusCode: 404, message: err.response.data.message, urlTo: err.response.data.data.urlTo, title: err.response.data.data.title });
        }
        //localStorage.removeItem('data');
        //return redirect('/');
      }
    }
  } else {
    return redirect('/');
  }

}

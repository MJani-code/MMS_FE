// prettier-ignore
import {
  APIPOST
} from "~/api/apiHelper";

// prettier-ignore
export default async function ({
  store,
  redirect,
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
            token: token
          });
          if (response.data.status !== 200) {
            //localStorage.removeItem('data'); // lejárt token törlése
            return redirect('/');
          }
        }

      } catch (err) {
        // Ha hiba történt a backend kérés közben, naplózzuk, és átirányítunk
        console.error("Token validálási hiba:", err);
        localStorage.removeItem('data');
        return redirect('/');
      }
    }
  } else {
    return redirect('/');
  }

}

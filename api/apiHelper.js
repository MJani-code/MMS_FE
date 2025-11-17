import axios from 'axios';

let host = '';
if (window.location.hostname === 'localhost') {
  host = 'http://localhost/MMS';
} else {
  host = window.location.origin;
}

export const config = {
  apiUrl: {
    login: host + '/MMS_BE/api/login.php',
    logout: host + '/MMS_BE/api/logout.php',
    auth: host + '/MMS_BE/api/auth.php',
    getAllTask: host + '/MMS_BE/api/task/getAllTask.php',
    updateTask: host + '/MMS_BE/api/task/updateTask.php',
    addFee: host + '/MMS_BE/api/task/addFee.php',
    addLocker: host + '/MMS_BE/api/task/addLocker.php',
    deleteFee: host + '/MMS_BE/api/task/deleteFee.php',
    removeLocker: host + '/MMS_BE/api/task/deleteLocker.php',
    getUser: host + '/MMS_BE/api/task/getUser.php',
    updateUser: host + '/MMS_BE/api/task/updateUser.php',
    createTaskBatch: host + '/MMS_BE/api/task/createTaskBatch.php',
    downloadTig: host + '/MMS_BE/api/task/downloadTig.php',
    downloadTasks: host + '/MMS_BE/api/task/downloadTasks.php',
    verifyLocker: host + '/MMS_BE/api/task/verifyLocker.php',
    getLockerFromLos: host + '/MMS_BE/api/task/getLockerFromLos.php',
    getDataForCreateTask: host + '/MMS_BE/api/task/getDataForCreateTask.php',
    createTask: host + '/MMS_BE/api/task/createTask.php',
    deletePhoto: host + '/MMS_BE/api/task/deletePhoto.php',
    getTaskLockersIssues: host + '/MMS_BE/api/task/getTaskLockersIssues.php',
    addIntervention: host + '/MMS_BE/api/task/addIntervention.php',
    deleteIntervention: host + '/MMS_BE/api/task/deleteIntervention.php',
    Locations_GetCountryPublicLocations:
      host + '/MMS_BE/api/task/d4me/Locations_GetCountryPublicLocations.php',
    downloadNewPoints: host + '/MMS_BE/api/task/downloadNewPoints.php',
    downloadNotifications:
      host + '/MMS_BE/api/notifications/getNotifications.php',
    readNotifications: host + '/MMS_BE/api/notifications/readNotifications.php',
    getStockItems: host + '/MMS_BE/api/parts/getStockItems.php',
    getPartsMasterData: host + '/MMS_BE/api/parts/getPartsMasterData.php',
    addPartToStock: host + '/MMS_BE/api/parts/addPartToStock.php',
    updatePartInStock: host + '/MMS_BE/api/parts/updatePartInStock.php',
    getPartsHistory: host + '/MMS_BE/api/parts/getPartsHistory.php'
  }
};
const API = axios.create({
  // baseURL: process.env.API_URL ?? 'http://',
  timeout: 20000
  // headers: {
  //   'Authorization': `Bearer ${token}`
  // }
});

export const APIPOST = async (endpoint, data, token, download) => {
  const url = config.apiUrl[endpoint];
  return await API.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    ...(download ? { responseType: 'blob' } : {})
  });
};

export const APIPOST2 = async (endpoint, data, token) => {
  const url = config.apiUrl[endpoint];
  return await API.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });
};

export const APIGET = async (endpoint, params, token) => {
  const url = config.apiUrl[endpoint];
  return await API.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    ...(params ? { params } : {})
  });
};

export const APIPUT = async (url, data) => {
  return await API.put(url, data);
};

export const APIDELETE = async (url) => {
  return await API.delete(url);
};

export const APIUPLOAD = async (endpoint, data, token) => {
  const url = config.apiUrl[endpoint];
  return await API.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });
};

export const APIDOWNLOAD = async (endpoint, token) => {
  const url = config.apiUrl[endpoint];
  return await API.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'blob'
  });
};

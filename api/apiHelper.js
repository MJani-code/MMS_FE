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
    downloadTig: host + '/MMS_BE/api/task/downloadTig.php'
  }
};
const API = axios.create({
  // baseURL: process.env.API_URL ?? 'http://',
  timeout: 3000
  // headers: {
  //   'Authorization': `Bearer ${token}`
  // }
});

export const APIPOST = async (endpoint, data, token) => {
  const url = config.apiUrl[endpoint];
  return await API.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
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

export const APIGET = async (endpoint, token) => {
  const url = config.apiUrl[endpoint];
  return await API.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
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

import axios from 'axios';

let host = '';
if (window.location.hostname === 'localhost') {
  host = 'http://localhost:5000';
} else {
  host = window.location.origin;
}

export const config = {
  apiUrl: {
    login: host + '/build_mate_be/API/login.php',
    logout: host + '/build_mate_be/API/logout.php',
    auth: host + '/build_mate_be/API/auth.php',
    getAllTask: host + '/MMS/MMS_BE/api/task/getAllTask.php',
    updateTask: host + '/MMS/MMS_BE/api/task/updateTask.php',
    addFee: host + '/MMS/MMS_BE/api/task/addFee.php'
  }
};

const API = axios.create({
  // baseURL: process.env.API_URL ?? 'http://',
  timeout: 3000
  // headers: {'Authorization': `Bearer ${token}`}
});

export const APIPOST = async (endpoint, data) => {
  const url = config.apiUrl[endpoint];
  return await API.post(url, data);
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

export const APIGET = async (endpoint) => {
  const url = config.apiUrl[endpoint];
  return await API.get(url);
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

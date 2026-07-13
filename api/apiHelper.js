import axios from 'axios';
import { getStoredVersion } from '@/utils/versioning';

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
    getTaskStatuses: host + '/MMS_BE/api/task/getTaskStatuses.php',
    getTasksByStatus: host + '/MMS_BE/api/task/getTasksByStatus.php',
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
    verifyD4meLocker: host + '/MMS_BE/api/task/d4me/verifyD4meLocker.php',
    getLockerFromLos: host + '/MMS_BE/api/task/getLockerFromLos.php',
    getDataForCreateTask: host + '/MMS_BE/api/task/getDataForCreateTask.php',
    createTask: host + '/MMS_BE/api/task/createTask.php',
    deleteMedia: host + '/MMS_BE/api/task/deleteMedia.php',
    getTaskLockersIssues: host + '/MMS_BE/api/task/getTaskLockersIssues.php',
    addIntervention: host + '/MMS_BE/api/task/addIntervention.php',
    deleteIntervention: host + '/MMS_BE/api/task/deleteIntervention.php',
    Locations_GetCountryPublicLocations:
      host + '/MMS_BE/api/task/d4me/Locations_GetCountryPublicLocations.php',
    getDirect4MeLocations:
      host + '/MMS_BE/api/task/d4me/Locations_GetCountryPublicLocations.php',
    downloadNewPoints: host + '/MMS_BE/api/task/downloadNewPoints.php',
    downloadNotifications:
      host + '/MMS_BE/api/notifications/getNotifications.php',
    readNotifications: host + '/MMS_BE/api/notifications/readNotifications.php',
    getStockItems: host + '/MMS_BE/api/parts/getStockItems.php',
    getPartsMasterData: host + '/MMS_BE/api/parts/getPartsMasterData.php',
    addPartToStock: host + '/MMS_BE/api/parts/addPartToStock.php',
    updatePartInStock: host + '/MMS_BE/api/parts/updatePartInStock.php',
    getPartsHistory: host + '/MMS_BE/api/parts/getPartsHistory.php',
    updateTaskInBatch: host + '/MMS_BE/api/task/updateTaskInBatch.php',
    uploadMedia: host + '/MMS_BE/api/task/uploadMedia.php',
    getInitialData: host + '/MMS_BE/api/task/getInitialData.php',
    getTask: host + '/MMS_BE/api/task/getTask.php'
  }
};

const resolveEndpointUrl = (endpoint) => {
  const rawUrl = config.apiUrl[endpoint];
  const version = getStoredVersion();

  if (!rawUrl || typeof rawUrl !== 'string') {
    return rawUrl;
  }

  if (version === 'v1') {
    if (rawUrl.includes('/MMS_BE/api/v1/')) {
      return rawUrl;
    }
    return rawUrl.replace('/MMS_BE/api/', '/MMS_BE/api/v1/');
  }

  return rawUrl.replace('/MMS_BE/api/v1/', '/MMS_BE/api/');
};

const API = axios.create({
  // baseURL: process.env.API_URL ?? 'http://',
  timeout: 20000
  // headers: {
  //   'Authorization': `Bearer ${token}`
  // }
});

const FALLBACK_LOCALE = 'hu';

const getCurrentLocale = () => {
  if (typeof window === 'undefined') {
    return FALLBACK_LOCALE;
  }

  const appLocale = localStorage.getItem('appLocale');
  if (appLocale) {
    return appLocale;
  }

  const storedData = localStorage.getItem('data');
  if (!storedData) {
    return FALLBACK_LOCALE;
  }

  try {
    const parsed = JSON.parse(storedData);
    return parsed.locale || FALLBACK_LOCALE;
  } catch (_error) {
    return FALLBACK_LOCALE;
  }
};

const withLocalePayload = (data) => {
  const locale = getCurrentLocale();

  if (data instanceof FormData) {
    if (!data.has('locale')) {
      data.append('locale', locale);
    }
    return data;
  }

  if (data && typeof data === 'object') {
    if (Object.prototype.hasOwnProperty.call(data, 'locale')) {
      return data;
    }
    return {
      ...data,
      locale
    };
  }

  return {
    value: data,
    locale
  };
};

export const APIPOST = async (endpoint, data, token, download) => {
  const url = resolveEndpointUrl(endpoint);
  return await API.post(url, withLocalePayload(data), {
    headers: {
      Authorization: `Bearer ${token}`
    },
    ...(download ? { responseType: 'blob' } : {})
  });
};

export const APIPOST2 = async (endpoint, data, token) => {
  const url = resolveEndpointUrl(endpoint);
  return await API.post(url, withLocalePayload(data), {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });
};

export const APIGET = async (endpoint, params, token) => {
  const url = resolveEndpointUrl(endpoint);
  return await API.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    ...(params ? { params } : {})
  });
};

export const APIPUT = async (endpoint, data, token) => {
  const url = resolveEndpointUrl(endpoint);
  return await API.put(url, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const APIDELETE = async (endpoint, data, token) => {
  const url = resolveEndpointUrl(endpoint);
  return await API.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: data
  });
};

export const APIUPLOAD = async (endpoint, data, token) => {
  const url = resolveEndpointUrl(endpoint);
  return await API.post(url, withLocalePayload(data), {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });
};

export const APIDOWNLOAD = async (endpoint, token) => {
  const url = resolveEndpointUrl(endpoint);
  return await API.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'blob'
  });
};

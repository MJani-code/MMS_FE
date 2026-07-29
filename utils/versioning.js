export const DEFAULT_APP_VERSION = 'v2';

const SUPPORTED_VERSIONS = ['v1', 'v2'];

export const normalizeVersion = (version) => {
  return SUPPORTED_VERSIONS.includes(version) ? version : DEFAULT_APP_VERSION;
};

export const getStoredVersion = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_APP_VERSION;
  }

  return normalizeVersion(localStorage.getItem('appVersion'));
};

export const setStoredVersion = (version) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('appVersion', normalizeVersion(version));
};

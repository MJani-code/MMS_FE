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

const splitPathAndSuffix = (path = '/') => {
  const hashIndex = path.indexOf('#');
  const queryIndex = path.indexOf('?');

  let splitIndex = -1;
  if (hashIndex === -1) {
    splitIndex = queryIndex;
  } else if (queryIndex === -1) {
    splitIndex = hashIndex;
  } else {
    splitIndex = Math.min(hashIndex, queryIndex);
  }

  if (splitIndex === -1) {
    return {
      pathname: path,
      suffix: ''
    };
  }

  return {
    pathname: path.slice(0, splitIndex),
    suffix: path.slice(splitIndex)
  };
};

const sanitizePathname = (pathname = '/') => {
  if (!pathname) {
    return '/';
  }

  if (!pathname.startsWith('/')) {
    return `/${pathname}`;
  }

  return pathname;
};

const removeExistingVersionPrefix = (pathname = '/') => {
  const safePath = sanitizePathname(pathname);

  if (safePath === '/v1' || safePath.startsWith('/v1/')) {
    const stripped = safePath.slice(3);
    return stripped || '/';
  }

  if (safePath === '/v2' || safePath.startsWith('/v2/')) {
    const stripped = safePath.slice(3);
    return stripped || '/';
  }

  return safePath;
};

export const applyVersionPrefix = (path, version) => {
  if (!path || typeof path !== 'string') {
    return path;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const { pathname, suffix } = splitPathAndSuffix(path);
  const basePath = removeExistingVersionPrefix(pathname);
  const targetVersion = normalizeVersion(version);

  const versionedPath =
    targetVersion === 'v1'
      ? basePath === '/'
        ? '/v1'
        : `/v1${basePath}`
      : basePath;

  return `${versionedPath}${suffix}`;
};

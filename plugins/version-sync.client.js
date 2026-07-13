import { applyVersionPrefix, getStoredVersion } from '@/utils/versioning';

const normalizeLocation = (location, version) => {
  if (!location) {
    return location;
  }

  if (typeof location === 'string') {
    return applyVersionPrefix(location, version);
  }

  if (location.path) {
    return {
      ...location,
      path: applyVersionPrefix(location.path, version)
    };
  }

  return location;
};

export default ({ app }) => {
  const router = app.router;

  if (!router) {
    return;
  }

  const originalPush = router.push.bind(router);
  const originalReplace = router.replace.bind(router);

  const wrapNavigate = (navigate) => {
    return (location, onComplete, onAbort) => {
      const version = getStoredVersion();
      const normalizedLocation = normalizeLocation(location, version);
      return navigate(normalizedLocation, onComplete, onAbort);
    };
  };

  router.push = wrapNavigate(originalPush);
  router.replace = wrapNavigate(originalReplace);

  const syncCurrentRouteWithVersion = () => {
    const version = getStoredVersion();
    const current = router.currentRoute;

    if (!current) {
      return;
    }

    const normalizedPath = applyVersionPrefix(current.fullPath, version);
    if (normalizedPath !== current.fullPath) {
      originalReplace(normalizedPath);
    }
  };

  syncCurrentRouteWithVersion();
  router.afterEach(() => {
    syncCurrentRouteWithVersion();
  });
};

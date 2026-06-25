const FALLBACK_LOCALE = 'hu';

function loadLocaleFromStorage() {
  const appLocale = localStorage.getItem('appLocale');
  if (appLocale) {
    return appLocale;
  }

  const data = localStorage.getItem('data');
  if (!data) {
    return FALLBACK_LOCALE;
  }

  try {
    const parsed = JSON.parse(data);
    return parsed.locale || FALLBACK_LOCALE;
  } catch (_error) {
    return FALLBACK_LOCALE;
  }
}

export default ({ app, store }) => {
  const locale = loadLocaleFromStorage();
  store.commit('setLocale', locale);
  app.i18n.setLocale(locale);
};

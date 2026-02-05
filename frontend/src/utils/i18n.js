import translations from '../locales/pl.json';

const resolveKey = (key) => key.split('.').reduce((acc, part) => acc?.[part], translations);

export const t = (key, params = {}) => {
  const value = resolveKey(key);
  if (typeof value !== 'string') {
    return key;
  }

  return Object.entries(params).reduce(
    (acc, [paramKey, paramValue]) => acc.replaceAll(`{${paramKey}}`, String(paramValue)),
    value
  );
};

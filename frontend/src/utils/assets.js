const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/$/, '');

export function toApiAssetUrl(pathOrUrl) {
  if (!pathOrUrl) {
    return '';
  }

  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith('data:')) {
    return pathOrUrl;
  }

  if (!pathOrUrl.startsWith('/')) {
    return pathOrUrl;
  }

  return API_BASE_URL ? `${API_BASE_URL}${pathOrUrl}` : pathOrUrl;
}

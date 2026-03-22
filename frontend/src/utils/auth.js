const AUTH_STORAGE_KEY = 'braiderski.auth';
export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

export const getStoredSession = () => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    if (!isSessionValid(session)) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const storeSession = (session) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getAuthToken = () => {
  const session = getStoredSession();
  return session?.token ?? null;
};

export const isSessionValid = (session) => {
  if (!session?.token) {
    return false;
  }

  if (!session.expiresAt) {
    return true;
  }

  const expiresAt = new Date(session.expiresAt);
  return !Number.isNaN(expiresAt.getTime()) && expiresAt > new Date();
};

export const notifyUnauthorized = () => {
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
};

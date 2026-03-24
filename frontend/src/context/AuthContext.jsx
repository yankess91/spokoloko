import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api';
import {
  clearSession,
  getStoredSession,
  storeSession,
  UNAUTHORIZED_EVENT,
} from '../utils/auth';
import { t } from '../utils/i18n';
import { useToast } from '../components/ToastProvider';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStoredSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const clearSessionState = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const login = useCallback(async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authApi.login(payload);
      const nextSession = { token: result.token, user: result.user, expiresAt: result.expiresAt };

      storeSession(nextSession);
      setSession(nextSession);

      return { ok: true };
    } catch (err) {
      setError(err.message ?? t('errors.login'));
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSessionState();
  }, [clearSessionState]);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (!session?.token) {
        return;
      }

      clearSessionState();
      showToast(t('errors.sessionExpired'), { severity: 'warning' });
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [clearSessionState, session?.token, showToast]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.token),
      loading,
      error,
      login,
      logout
    }),
    [session, loading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

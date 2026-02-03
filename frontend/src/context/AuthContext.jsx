import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authApi } from '../api';
import { clearSession, getStoredSession, storeSession } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStoredSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authApi.login(payload);
      storeSession({ token: result.token, user: result.user, expiresAt: result.expiresAt });
      setSession({ token: result.token, user: result.user, expiresAt: result.expiresAt });
      return { ok: true };
    } catch (err) {
      setError('Nie udało się zalogować. Sprawdź dane.');
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authApi.register(payload);
      storeSession({ token: result.token, user: result.user, expiresAt: result.expiresAt });
      setSession({ token: result.token, user: result.user, expiresAt: result.expiresAt });
      return { ok: true };
    } catch (err) {
      setError('Nie udało się utworzyć konta. Sprawdź dane.');
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.token),
      loading,
      error,
      login,
      register,
      logout
    }),
    [session, loading, error, login, register, logout]
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

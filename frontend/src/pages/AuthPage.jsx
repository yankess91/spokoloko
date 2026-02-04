import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  password: ''
};

const AuthPage = ({ mode }) => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();
  const isRegister = mode === 'register';
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, { severity: 'error' });
    }
  }, [error, showToast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = isRegister ? register : login;
    const payload = isRegister
      ? {
          fullName: values.fullName,
          email: values.email,
          password: values.password
        }
      : {
          email: values.email,
          password: values.password
        };

    const result = await action(payload);
    if (result.ok) {
      navigate('/', { replace: true });
    }
  };

  const logoSrc = '/spokoloko-logo.png';

  return (
    <div className="auth-shell">
      <section className="auth-brand">
        <div className="auth-brand-card">
          <img className="auth-logo-image" src={logoSrc} alt="Spoko Loko logo" />
          <p className="auth-tagline">
            Nowoczesny panel do zarządzania klientkami, wizytami i produktami w salonie.
          </p>
          <div className="auth-badges">
            <span>Bezpieczne logowanie</span>
            <span>Panel w czasie rzeczywistym</span>
            <span>Pełna kontrola</span>
          </div>
        </div>
      </section>
      <section className="auth-form">
        <div className="auth-card">
          <p className="auth-eyebrow">{isRegister ? 'Załóż konto' : 'Witamy ponownie'}</p>
          <h1>{isRegister ? 'Rejestracja konta' : 'Logowanie do panelu'}</h1>
          <p className="auth-subtitle">
            {isRegister
              ? 'Utwórz bezpieczny dostęp do panelu i zacznij zarządzać usługami.'
              : 'Zaloguj się, aby zobaczyć aktualne wizyty i klientów.'}
          </p>
          <form className="auth-fields" onSubmit={handleSubmit}>
            {isRegister && (
              <label>
                Imię i nazwisko
                <input
                  name="fullName"
                  type="text"
                  value={values.fullName}
                  onChange={handleChange}
                  placeholder="np. Anna Kowalska"
                  required
                />
              </label>
            )}
            <label>
              Email
              <input
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="np. anna@salon.pl"
                required
              />
            </label>
            <label>
              Hasło
              <input
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Co najmniej 8 znaków"
                minLength={8}
                required
              />
            </label>
            <button className="primary" type="submit" disabled={loading}>
              {loading ? 'Przetwarzanie…' : isRegister ? 'Załóż konto' : 'Zaloguj się'}
            </button>
          </form>
          <div className="auth-switch">
            {isRegister ? (
              <>
                Masz już konto? <Link to="/login">Zaloguj się</Link>
              </>
            ) : (
              <>
                Nie masz konta? <Link to="/register">Zarejestruj się</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthPage;

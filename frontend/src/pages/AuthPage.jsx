import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { t } from '../utils/i18n';

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

  const logoSrc = '/src/assets/spokoloko-logo2.png';

  return (
    <div className="auth-shell">
      <section className="auth-brand">
        <div className="auth-brand-card">
          <img className="auth-logo-image" src={logoSrc} alt={t('auth.logoAlt')} />
        </div>
      </section>
      <section className="auth-form">
        <div className="auth-card">
          <p className="auth-eyebrow">
            {isRegister ? t('auth.registerEyebrow') : t('auth.loginEyebrow')}
          </p>
          <h1>{isRegister ? t('auth.registerTitle') : t('auth.loginTitle')}</h1>
          <p className="auth-subtitle">
            {isRegister
              ? t('auth.registerSubtitle')
              : t('auth.loginSubtitle')}
          </p>
          <form className="auth-fields" onSubmit={handleSubmit}>
            {isRegister && (
              <label>
                {t('auth.fullName')}
                <input
                  name="fullName"
                  type="text"
                  value={values.fullName}
                  onChange={handleChange}
                  placeholder={t('auth.fullNamePlaceholder')}
                  required
                />
              </label>
            )}
            <label>
              {t('auth.email')}
              <input
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </label>
            <label>
              {t('auth.password')}
              <input
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                placeholder={t('auth.passwordPlaceholder')}
                minLength={8}
                required
              />
            </label>
            <button className="primary" type="submit" disabled={loading}>
              {loading
                ? t('auth.processing')
                : isRegister
                  ? t('auth.registerAction')
                  : t('auth.loginAction')}
            </button>
          </form>
          <div className="auth-switch">
            {isRegister ? (
              <>
                {t('auth.haveAccount')} <Link to="/login">{t('auth.loginLink')}</Link>
              </>
            ) : (
              <>
                {t('auth.noAccount')} <Link to="/register">{t('auth.registerLink')}</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthPage;

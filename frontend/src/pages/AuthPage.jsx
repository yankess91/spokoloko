import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { t } from '../utils/i18n';
import logoSrc from '../assets/spokoloko-logo2.png';

const INITIAL_VALUES = {
  email: '',
  password: ''
};

const AuthPage = () => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
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
    const result = await login({
      email: values.email,
      password: values.password
    });
    if (result.ok) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-brand">
        <div className="auth-brand-card">
          <img className="auth-logo-image" src={logoSrc} alt={t('auth.logoAlt')} />
        </div>
      </section>
      <section className="auth-form">
        <div className="auth-card">
          <p className="auth-eyebrow">{t('auth.loginEyebrow')}</p>
          <h1>{t('auth.loginTitle')}</h1>
          <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>
          <form className="auth-fields" onSubmit={handleSubmit}>
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
              {loading ? t('auth.processing') : t('auth.loginAction')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AuthPage;

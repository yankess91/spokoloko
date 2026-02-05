import { Link } from 'react-router-dom';
import { t } from '../utils/i18n';

export default function HeroSection({ summary, upcomingAppointment, isLoading }) {
  return (
    <header className="hero">
      <div className="hero-main">
        <p className="eyebrow">{t('hero.eyebrow')}</p>
        <h1>{t('hero.title')}</h1>
        <p className="subtitle">
          {t('hero.subtitle')}
        </p>
        <div className="hero-actions">
          <Link className="primary" to="/clients">
            {t('hero.addClient')}
          </Link>
          <Link className="secondary" to="/appointments">
            {t('hero.planAppointment')}
          </Link>
        </div>
        <p className="muted">
          {t('hero.currentStatus', {
            clients: summary.clients,
            services: summary.services,
            products: summary.products,
          })}
        </p>
      </div>
      <div className="hero-card">
        <div className="card-header">
          <h2>{t('hero.upcomingTitle')}</h2>
        </div>
        {isLoading ? (
          <p className="muted">{t('hero.loading')}</p>
        ) : upcomingAppointment ? (
          <>
            <p className="hero-label">
              {t('hero.clientLabel', { name: upcomingAppointment.clientName })}
            </p>
            <p>{t('hero.serviceLabel', { name: upcomingAppointment.serviceName })}</p>
            <p>
              {t('hero.dateLabel', {
                date: upcomingAppointment.date,
                time: upcomingAppointment.time,
              })}
            </p>
            <Link className="secondary" to={`/appointments/${upcomingAppointment.id}`}>
              {t('hero.viewDetails')}
            </Link>
          </>
        ) : (
          <p className="muted">{t('hero.noAppointments')}</p>
        )}
      </div>
    </header>
  );
}

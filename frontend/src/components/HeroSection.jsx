import { Link } from 'react-router-dom';

export default function HeroSection({ summary, upcomingAppointment, isLoading }) {
  return (
    <header className="hero">
      <div className="hero-main">
        <p className="eyebrow">System rezerwacyjny</p>
        <h1>Salon braiderski - panel zarządzania</h1>
        <p className="subtitle">
          Profil klienta, lista produktów i usług oraz kalendarz wizyt bez modułu płatności.
        </p>
        <div className="hero-actions">
          <Link className="primary" to="/clients">
            Dodaj klienta
          </Link>
          <Link className="ghost" to="/appointments">
            Zaplanuj wizytę
          </Link>
        </div>
        <dl className="hero-stats">
          <div>
            <dt>Klientki</dt>
            <dd>{summary.clients}</dd>
          </div>
          <div>
            <dt>Usługi</dt>
            <dd>{summary.services}</dd>
          </div>
          <div>
            <dt>Produkty</dt>
            <dd>{summary.products}</dd>
          </div>
        </dl>
      </div>
      <div className="hero-card">
        <div className="card-header">
          <h2>Nadchodząca wizyta</h2>
        </div>
        {isLoading ? (
          <p className="muted">Ładowanie danych o wizytach...</p>
        ) : upcomingAppointment ? (
          <>
            <p className="hero-label">Klientka: {upcomingAppointment.clientName}</p>
            <p>Usługa: {upcomingAppointment.serviceName}</p>
            <p>
              Data: {upcomingAppointment.date}, {upcomingAppointment.time}
            </p>
            <Link className="secondary" to={`/appointments/${upcomingAppointment.id}`}>
              Zobacz szczegóły
            </Link>
          </>
        ) : (
          <p className="muted">Brak zaplanowanych wizyt.</p>
        )}
      </div>
    </header>
  );
}

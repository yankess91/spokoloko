import { Link } from 'react-router-dom';

export default function HeroSection({ summary, upcomingAppointment, isLoading }) {
  return (
    <header className="hero">
      <div className="hero-main">
        <p className="eyebrow">System rezerwacyjny</p>
        <h1>Nowoczesny panel do obsługi salonu i rezerwacji</h1>
        <p className="subtitle">
          Zarządzaj klientkami, usługami i produktami w jednym miejscu. Buduj plan
          tygodnia dzięki intuicyjnemu kalendarzowi wizyt.
        </p>
        <div className="hero-actions">
          <Link className="primary" to="/clients">
            Dodaj klientkę
          </Link>
          <Link className="secondary" to="/appointments">
            Zaplanuj wizytę
          </Link>
        </div>
        <p className="muted">
          Aktualny stan: {summary.clients} klientek, {summary.services} usług,{' '}
          {summary.products} produktów.
        </p>
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

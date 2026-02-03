export default function HeroSection({ summary, upcomingAppointment, isLoading }) {
  return (
    <header className="hero">
      <div>
        <p className="eyebrow">System rezerwacyjny</p>
        <h1>Salon braiderski - panel zarządzania</h1>
        <p className="subtitle">
          Profil klienta, lista produktów i usług oraz kalendarz wizyt bez modułu płatności.
        </p>
        <div className="hero-actions">
          <button className="primary">Dodaj klienta</button>
          <button className="ghost">Zaplanuj wizytę</button>
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
        <h2>Nadchodząca wizyta</h2>
        {isLoading ? (
          <p className="muted">Ładowanie danych o wizytach...</p>
        ) : upcomingAppointment ? (
          <>
            <p className="hero-label">Klientka: {upcomingAppointment.clientName}</p>
            <p>Usługa: {upcomingAppointment.serviceName}</p>
            <p>
              Data: {upcomingAppointment.date}, {upcomingAppointment.time}
            </p>
            <button className="secondary">Edytuj szczegóły</button>
          </>
        ) : (
          <p className="muted">Brak zaplanowanych wizyt.</p>
        )}
      </div>
    </header>
  );
}

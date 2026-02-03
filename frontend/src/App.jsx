const services = [
  { name: 'Box braids', duration: '3h' },
  { name: 'Twists', duration: '2h' },
  { name: 'Cornrows', duration: '1.5h' }
];

const products = [
  { name: 'Krem nawilżający', brand: 'CurlCare' },
  { name: 'Olej arganowy', brand: 'NaturOil' },
  { name: 'Spray ochronny', brand: 'BraidsPro' }
];

const calendar = [
  { date: '2024-09-20', slots: ['10:00', '13:00', '16:00'] },
  { date: '2024-09-21', slots: ['09:30', '12:30'] },
  { date: '2024-09-22', slots: ['11:00', '15:00'] }
];

export default function App() {
  return (
    <div className="page">
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
        </div>
        <div className="hero-card">
          <h2>Nadchodząca wizyta</h2>
          <p className="hero-label">Klientka: Ada K.</p>
          <p>Usługa: Box braids</p>
          <p>Data: 2024-09-20, 13:00</p>
          <button className="secondary">Edytuj szczegóły</button>
        </div>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Profil klienta</h2>
          <form className="form">
            <label>
              Imię i nazwisko
              <input placeholder="np. Anna Nowak" />
            </label>
            <label>
              Email
              <input type="email" placeholder="anna@example.com" />
            </label>
            <label>
              Telefon
              <input placeholder="+48 600 000 000" />
            </label>
            <label>
              Ostatnio użyte produkty
              <textarea placeholder="np. olej arganowy" rows="3" />
            </label>
            <button type="button" className="primary">Zapisz profil</button>
          </form>
        </article>

        <article className="card">
          <h2>Lista usług</h2>
          <ul className="list">
            {services.map((service) => (
              <li key={service.name}>
                <span>{service.name}</span>
                <span className="muted">{service.duration}</span>
              </li>
            ))}
          </ul>
          <button className="ghost">Dodaj usługę</button>
        </article>

        <article className="card">
          <h2>Lista produktów</h2>
          <ul className="list">
            {products.map((product) => (
              <li key={product.name}>
                <span>{product.name}</span>
                <span className="muted">{product.brand}</span>
              </li>
            ))}
          </ul>
          <button className="ghost">Dodaj produkt</button>
        </article>
      </section>

      <section className="card calendar">
        <h2>Kalendarz wizyt</h2>
        <div className="calendar-grid">
          {calendar.map((day) => (
            <div key={day.date} className="calendar-day">
              <p className="calendar-date">{day.date}</p>
              <div className="slots">
                {day.slots.map((slot) => (
                  <span key={slot} className="slot">{slot}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

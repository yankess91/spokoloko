export default function ServiceList({ services, isLoading }) {
  return (
    <article className="card">
      <h2>Wszystkie usługi</h2>
      {isLoading ? (
        <p className="muted">Ładowanie usług...</p>
      ) : services.length === 0 ? (
        <p className="muted">Brak usług do wyświetlenia.</p>
      ) : (
        <ul className="list">
          {services.map((service) => (
            <li key={service.id}>
              <span>{service.name}</span>
              <span className="muted">{service.duration}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="ghost">Dodaj usługę</button>
    </article>
  );
}

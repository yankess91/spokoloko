import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

export default function ServiceList({ services, isLoading, linkBase }) {
  return (
    <article className="card">
      <header className="card-header">
        <h2>Wszystkie usługi</h2>
      </header>
      {isLoading ? (
        <p className="muted">Ładowanie usług...</p>
      ) : services.length === 0 ? (
        <p className="muted">Brak usług do wyświetlenia.</p>
      ) : (
        <ul className="list">
          {services.map((service) => (
            <li key={service.id}>
              <div className="list-item-main">
                {linkBase ? (
                  <Link className="list-title" to={`${linkBase}/${service.id}`}>
                    {service.name}
                  </Link>
                ) : (
                  <span className="list-title">{service.name}</span>
                )}
                <span className="list-meta">
                  {service.duration} · {formatCurrency(service.price)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

export default function ServiceList({ services, isLoading, linkBase }) {
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
              {linkBase ? (
                <Link className="list-title" to={`${linkBase}/${service.id}`}>
                  {service.name}
                </Link>
              ) : (
                <span className="list-title">{service.name}</span>
              )}
              <span className="muted">
                {service.duration} · {formatCurrency(service.price)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

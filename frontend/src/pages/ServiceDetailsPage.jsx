import { Link, useParams } from 'react-router-dom';
import useServiceDetails from '../hooks/useServiceDetails';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const { service, isLoading, error } = useServiceDetails(id);

  if (isLoading) {
    return <p className="card muted">Ładowanie usługi...</p>;
  }

  if (error) {
    return <p className="card error">{error}</p>;
  }

  if (!service) {
    return <p className="card muted">Nie znaleziono usługi.</p>;
  }

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{service.name}</h1>
        <p className="muted">Szczegóły usługi.</p>
        <Link className="ghost" to="/services">
          Wróć do listy
        </Link>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Opis</h2>
          <p>{service.description || 'Brak opisu'}</p>
          <p>Czas trwania: {service.duration}</p>
        </article>
      </section>
    </div>
  );
}

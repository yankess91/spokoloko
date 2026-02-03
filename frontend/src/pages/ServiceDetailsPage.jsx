import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useServiceDetails from '../hooks/useServiceDetails';
import { useToast } from '../components/ToastProvider';
import { formatCurrency } from '../utils/formatters';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const { service, isLoading, error } = useServiceDetails(id);
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, { severity: 'error' });
    }
  }, [error, showToast]);

  if (isLoading) {
    return <p className="card muted">Ładowanie usługi...</p>;
  }

  if (!service && !error) {
    return <p className="card muted">Nie znaleziono usługi.</p>;
  }

  if (error) {
    return <div className="page-content" />;
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
          <p>Cena: {formatCurrency(service.price)}</p>
        </article>
        <article className="card">
          <h2>Wymagane produkty</h2>
          {service.requiredProducts?.length ? (
            <ul className="list stacked">
              {service.requiredProducts.map((product) => (
                <li key={product.id}>
                  <span className="list-title">{product.name}</span>
                  <span className="muted">{product.brand || 'Brak marki'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Brak przypiętych produktów.</p>
          )}
        </article>
      </section>
    </div>
  );
}

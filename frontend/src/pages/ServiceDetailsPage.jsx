import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useServiceDetails from '../hooks/useServiceDetails';
import { useToast } from '../components/ToastProvider';
import { formatCurrency } from '../utils/formatters';
import { servicesApi } from '../api';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const { service, isLoading, error } = useServiceDetails(id);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!service || isDeleting) {
      return;
    }

    const confirmed = window.confirm(`Czy na pewno chcesz usunąć usługę: ${service.name}?`);
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await servicesApi.delete(service.id);
      showToast('Usługa została usunięta.');
      navigate('/services');
    } catch (err) {
      showToast(err.message ?? 'Nie udało się usunąć usługi.', { severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{service.name}</h1>
        <p className="muted">Szczegóły usługi.</p>
        <div className="section-actions">
          <Link className="ghost" to="/services">
            Wróć do listy
          </Link>
          <button type="button" className="secondary danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Usuwanie...' : 'Usuń usługę'}
          </button>
        </div>
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

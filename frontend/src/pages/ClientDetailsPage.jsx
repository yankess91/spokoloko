import { Link, useParams } from 'react-router-dom';
import useClientDetails from '../hooks/useClientDetails';

export default function ClientDetailsPage() {
  const { id } = useParams();
  const { client, isLoading, error } = useClientDetails(id);

  if (isLoading) {
    return <p className="card muted">Ładowanie profilu klientki...</p>;
  }

  if (error) {
    return <p className="card error">{error}</p>;
  }

  if (!client) {
    return <p className="card muted">Nie znaleziono profilu klientki.</p>;
  }

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{client.fullName}</h1>
        <p className="muted">Szczegóły profilu klientki.</p>
        <Link className="ghost" to="/clients">
          Wróć do listy
        </Link>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Dane kontaktowe</h2>
          <p>Email: {client.email || 'Brak emaila'}</p>
          <p>Telefon: {client.phoneNumber || 'Brak telefonu'}</p>
          <p>Uwagi: {client.notes || 'Brak uwag'}</p>
        </article>
        <article className="card">
          <h2>Ostatnio użyte produkty</h2>
          {client.usedProducts?.length ? (
            <ul className="list stacked">
              {client.usedProducts.map((product) => (
                <li key={product.id}>
                  <span className="list-title">{product.name}</span>
                  <span className="muted">{product.notes || 'Brak notatek'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Brak zapisanych produktów.</p>
          )}
        </article>
        <article className="card">
          <h2>Historia usług</h2>
          {client.serviceHistory?.length ? (
            <ul className="list stacked">
              {client.serviceHistory.map((history) => (
                <li key={history.appointmentId}>
                  <span className="list-title">{history.service?.name || 'Nieznana usługa'}</span>
                  <span className="muted">
                    {history.startAt
                      ? new Date(history.startAt).toLocaleDateString('pl-PL')
                      : 'Brak daty'}
                  </span>
                  <span className="muted">Uwagi: {history.notes || 'Brak notatek'}</span>
                  {history.usedProducts?.length ? (
                    <div className="chips">
                      {history.usedProducts.map((product) => (
                        <span key={product.id} className="chip">
                          {product.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="muted">Brak zapisanych produktów.</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Brak historii usług.</p>
          )}
        </article>
      </section>
    </div>
  );
}

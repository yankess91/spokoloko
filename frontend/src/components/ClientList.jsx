import { Link } from 'react-router-dom';

export default function ClientList({ clients, isLoading, linkBase }) {
  return (
    <article className="card">
      <header className="card-header">
        <h2>Wszystkie klientki</h2>
      </header>
      {isLoading ? (
        <p className="muted">Ładowanie klientek...</p>
      ) : clients.length === 0 ? (
        <p className="muted">Brak klientek do wyświetlenia.</p>
      ) : (
        <ul className="list stacked">
          {clients.map((client) => (
            <li key={client.id}>
              <div className="list-item-main">
                {linkBase ? (
                  <Link className="list-title" to={`${linkBase}/${client.id}`}>
                    {client.fullName}
                  </Link>
                ) : (
                  <span className="list-title">{client.fullName}</span>
                )}
                <span className="list-meta">
                  {client.email || 'Brak emaila'} · {client.phoneNumber || 'Brak telefonu'}
                </span>
              </div>
              <span className="muted">Produkty użyte: {client.usedProducts?.length ?? 0}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

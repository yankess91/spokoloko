export default function ClientList({ clients, isLoading }) {
  return (
    <article className="card">
      <h2>Wszystkie klientki</h2>
      {isLoading ? (
        <p className="muted">Ładowanie klientek...</p>
      ) : clients.length === 0 ? (
        <p className="muted">Brak klientek do wyświetlenia.</p>
      ) : (
        <ul className="list stacked">
          {clients.map((client) => (
            <li key={client.id}>
              <span className="list-title">{client.fullName}</span>
              <span className="muted">{client.email || 'Brak emaila'}</span>
              <span className="muted">{client.phoneNumber || 'Brak telefonu'}</span>
              <span className="muted">Produkty użyte: {client.usedProducts?.length ?? 0}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

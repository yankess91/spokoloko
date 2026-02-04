import { Link } from 'react-router-dom';

export default function ClientGrid({
  clients,
  isLoading,
  linkBase,
  onToggleStatus,
  updatingClientId
}) {
  if (isLoading) {
    return <p className="muted">Ładowanie klientek...</p>;
  }

  if (clients.length === 0) {
    return <p className="muted">Brak klientek do wyświetlenia.</p>;
  }

  return (
    <div className="data-grid" role="table" aria-label="Lista klientek">
      <div className="data-grid-row data-grid-header" role="row">
        <span className="data-grid-cell" role="columnheader">
          Klientka
        </span>
        <span className="data-grid-cell" role="columnheader">
          Status
        </span>
        <span className="data-grid-cell" role="columnheader">
          Produkty
        </span>
        <span className="data-grid-cell" role="columnheader">
          Akcje
        </span>
      </div>
      {clients.map((client) => {
        const isUpdating = updatingClientId === client.id;
        return (
          <div key={client.id} className="data-grid-row" role="row">
            <div className="data-grid-cell" role="cell">
              <div className="data-grid-title">{client.fullName}</div>
              <div className="data-grid-meta">
                {client.email || 'Brak emaila'} · {client.phoneNumber || 'Brak telefonu'}
              </div>
            </div>
            <div className="data-grid-cell" role="cell">
              <span className={`status-pill ${client.isActive ? 'active' : 'inactive'}`}>
                {client.isActive ? 'Aktywna' : 'Nieaktywna'}
              </span>
            </div>
            <div className="data-grid-cell" role="cell">
              {client.usedProducts?.length ?? 0}
            </div>
            <div className="data-grid-cell data-grid-actions" role="cell">
              {linkBase ? (
                <Link className="ghost" to={`${linkBase}/${client.id}`}>
                  Szczegóły
                </Link>
              ) : null}
              <button
                type="button"
                className="secondary"
                onClick={() => onToggleStatus?.(client)}
                disabled={isUpdating}
              >
                {isUpdating
                  ? 'Zapisywanie...'
                  : client.isActive
                  ? 'Dezaktywuj'
                  : 'Aktywuj'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

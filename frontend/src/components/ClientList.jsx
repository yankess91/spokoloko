import { Link } from 'react-router-dom';
import { t } from '../utils/i18n';

export default function ClientList({ clients, isLoading, linkBase }) {
  return (
    <article className="card">
      <header className="card-header">
        <h2>{t('clientList.previewTitle')}</h2>
      </header>
      {isLoading ? (
        <p className="muted">{t('clientList.loading')}</p>
      ) : clients.length === 0 ? (
        <p className="muted">{t('clientList.empty')}</p>
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
                  {client.email || t('clientList.noEmail')} ·{' '}
                  {client.phoneNumber || t('clientList.noPhone')}
                </span>
              </div>
              <div className="list-item-info">
                <span className={`status-pill ${client.isActive ? 'active' : 'inactive'}`}>
                  {client.isActive ? t('clientList.active') : t('clientList.inactive')}
                </span>
                <span className="muted">
                  {t('clientList.usedProducts', { count: client.usedProducts?.length ?? 0 })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

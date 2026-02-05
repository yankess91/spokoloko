import { Link } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { t } from '../utils/i18n';

export default function ClientGrid({
  clients,
  isLoading,
  linkBase,
  onToggleStatus,
  updatingClientId,
  onDelete
}) {
  if (isLoading) {
    return <p className="muted">{t('clientGrid.loading')}</p>;
  }

  if (clients.length === 0) {
    return <p className="muted">{t('clientGrid.empty')}</p>;
  }

  const isDeleteDisabled = !onDelete;

  return (
    <div className="data-grid" role="table" aria-label={t('clientGrid.ariaLabel')}>
      <div className="data-grid-row data-grid-header" role="row">
        <span className="data-grid-cell" role="columnheader">
          {t('clientGrid.columns.client')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('clientGrid.columns.status')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('clientGrid.columns.services')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('clientGrid.columns.actions')}
        </span>
      </div>
      {clients.map((client) => {
        const isUpdating = updatingClientId === client.id;
        return (
          <div key={client.id} className="data-grid-row" role="row">
            <div className="data-grid-cell" role="cell">
              <div className="data-grid-title">{client.fullName}</div>
              <div className="data-grid-meta">
                {client.email || t('clientGrid.noEmail')} ·{' '}
                {client.phoneNumber || t('clientGrid.noPhone')}
              </div>
            </div>
            <div className="data-grid-cell" role="cell">
              <span className={`status-pill ${client.isActive ? 'active' : 'inactive'}`}>
                {client.isActive ? t('clientGrid.active') : t('clientGrid.inactive')}
              </span>
            </div>
            <div className="data-grid-cell" role="cell">
              {client.serviceHistory?.length ?? 0}
            </div>
            <div className="data-grid-cell data-grid-actions" role="cell">
              {linkBase ? (
                <Link className="ghost" to={`${linkBase}/${client.id}`}>
                  <VisibilityOutlinedIcon fontSize="small" />
                  {t('clientGrid.details')}
                </Link>
              ) : null}
              <button
                type="button"
                className="secondary"
                onClick={() => onToggleStatus?.(client)}
                disabled={isUpdating}
              >
                {client.isActive ? (
                  <ToggleOffIcon fontSize="small" />
                ) : (
                  <ToggleOnIcon fontSize="small" />
                )}
                {isUpdating
                  ? t('clientGrid.saving')
                  : client.isActive
                  ? t('clientGrid.deactivate')
                  : t('clientGrid.activate')}
              </button>
              <button
                type="button"
                className="ghost danger icon-button"
                onClick={() => onDelete?.(client)}
                disabled={isDeleteDisabled}
                title={isDeleteDisabled ? t('clientGrid.deleteDisabled') : t('clientGrid.delete')}
              >
                <DeleteOutlineIcon fontSize="small" />
                {t('clientGrid.delete')}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

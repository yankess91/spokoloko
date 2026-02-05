import { Link } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { formatCurrency } from '../utils/formatters';
import { t } from '../utils/i18n';

export default function ServiceList({ services, isLoading, linkBase, onDelete }) {
  if (isLoading) {
    return <p className="muted">{t('serviceList.loading')}</p>;
  }

  if (services.length === 0) {
    return <p className="muted">{t('serviceList.empty')}</p>;
  }

  const isDeleteDisabled = !onDelete;

  return (
    <div className="data-grid data-grid-services" role="table" aria-label={t('serviceList.ariaLabel')}>
      <div className="data-grid-row data-grid-header" role="row">
        <span className="data-grid-cell" role="columnheader">
          {t('serviceList.columns.service')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('serviceList.columns.timePrice')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('serviceList.columns.products')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('serviceList.columns.actions')}
        </span>
      </div>
      {services.map((service) => {
        const requiredProducts =
          service.requiredProductIds?.length ?? service.requiredProducts?.length ?? 0;
        return (
          <div key={service.id} className="data-grid-row" role="row">
            <div className="data-grid-cell" role="cell">
              <div className="data-grid-title">{service.name}</div>
              <div className="data-grid-meta">
                {service.description || t('serviceList.noDescription')}
              </div>
            </div>
            <div className="data-grid-cell" role="cell">
              <span className="data-grid-title">{service.duration}</span>
              <span className="data-grid-meta">{formatCurrency(service.price)}</span>
            </div>
            <div className="data-grid-cell" role="cell">
              {requiredProducts}
            </div>
            <div className="data-grid-cell data-grid-actions" role="cell">
              {linkBase ? (
                <Link className="ghost" to={`${linkBase}/${service.id}`}>
                  <VisibilityOutlinedIcon fontSize="small" />
                  {t('serviceList.details')}
                </Link>
              ) : null}
              <button
                type="button"
                className="ghost danger icon-button"
                onClick={() => onDelete?.(service)}
                disabled={isDeleteDisabled}
                title={
                  isDeleteDisabled
                    ? t('serviceList.deleteDisabled')
                    : t('serviceList.delete')
                }
              >
                <DeleteOutlineIcon fontSize="small" />
                {t('serviceList.delete')}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

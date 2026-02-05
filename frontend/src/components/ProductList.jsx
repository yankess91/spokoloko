import { Link } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { t } from '../utils/i18n';

export default function ProductList({ products, isLoading, linkBase, onDelete }) {
  if (isLoading) {
    return <p className="muted">{t('productList.loading')}</p>;
  }

  if (products.length === 0) {
    return <p className="muted">{t('productList.empty')}</p>;
  }

  const isDeleteDisabled = !onDelete;

  return (
    <div className="data-grid data-grid-products" role="table" aria-label={t('productList.ariaLabel')}>
      <div className="data-grid-row data-grid-header" role="row">
        <span className="data-grid-cell" role="columnheader">
          {t('productList.columns.product')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('productList.columns.brand')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('productList.columns.image')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('productList.columns.actions')}
        </span>
      </div>
      {products.map((product) => (
        <div key={product.id} className="data-grid-row" role="row">
          <div className="data-grid-cell" role="cell">
            <div className="data-grid-title">{product.name}</div>
            <div className="data-grid-meta">{product.notes || t('productList.noNotes')}</div>
          </div>
          <div className="data-grid-cell" role="cell">
            {product.brand || t('productList.noBrand')}
          </div>
          <div className="data-grid-cell" role="cell">
            {product.imageUrl ? (
              <img className="thumb" src={product.imageUrl} alt={product.name} />
            ) : (
              <span className="data-grid-meta">{t('productList.noImage')}</span>
            )}
          </div>
          <div className="data-grid-cell data-grid-actions" role="cell">
            {linkBase ? (
              <Link className="ghost" to={`${linkBase}/${product.id}`}>
                <VisibilityOutlinedIcon fontSize="small" />
                {t('productList.details')}
              </Link>
            ) : null}
            <button
              type="button"
              className="ghost danger icon-button"
              onClick={() => onDelete?.(product)}
              disabled={isDeleteDisabled}
              title={
                isDeleteDisabled
                  ? t('productList.deleteDisabled')
                  : t('productList.delete')
              }
            >
              <DeleteOutlineIcon fontSize="small" />
              {t('productList.delete')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

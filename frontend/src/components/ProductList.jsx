import { Link } from 'react-router-dom';
import { useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import { formatCurrency, formatDate } from '../utils/formatters';
import { t } from '../utils/i18n';

export default function ProductList({ products, isLoading, linkBase, onDelete }) {
  const [zoomedImage, setZoomedImage] = useState(null);

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
          {t('productList.columns.manufacturer')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('productList.columns.price')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('productList.columns.availability')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('productList.columns.availabilityCheckedAt')}
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
            {formatCurrency(product.price)}
          </div>
          <div className="data-grid-cell" role="cell">
            {product.isAvailable ? t('productList.available') : t('productList.unavailable')}
          </div>
          <div className="data-grid-cell" role="cell">
            {product.availabilityCheckedAt
              ? formatDate(product.availabilityCheckedAt)
              : t('productList.noAvailabilityDate')}
          </div>
          <div className="data-grid-cell" role="cell">
            {product.imageUrl ? (
              <button
                type="button"
                className="thumb-button"
                onClick={() => setZoomedImage({ src: product.imageUrl, name: product.name })}
                title={t('productList.zoomImage')}
              >
                <img className="thumb" src={product.imageUrl} alt={product.name} />
                <span className="thumb-overlay">
                  <ZoomInIcon fontSize="small" />
                </span>
              </button>
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

      {zoomedImage ? (
        <div className="image-zoom-backdrop" onClick={() => setZoomedImage(null)}>
          <div className="image-zoom-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="ghost icon-button image-zoom-close"
              onClick={() => setZoomedImage(null)}
            >
              <CloseIcon fontSize="small" />
              {t('modal.close')}
            </button>
            <img className="image-zoom-preview" src={zoomedImage.src} alt={zoomedImage.name} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

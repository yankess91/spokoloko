import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import useProductDetails from '../hooks/useProductDetails';
import { useToast } from '../components/ToastProvider';
import { productsApi } from '../api';
import { t } from '../utils/i18n';
import { toApiAssetUrl } from '../utils/assets';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { product, isLoading, error } = useProductDetails(id);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (error) {
      showToast(error, { severity: 'error' });
    }
  }, [error, showToast]);

  if (isLoading) {
    return <p className="card muted">{t('productDetails.loading')}</p>;
  }

  if (!product && !error) {
    return <p className="card muted">{t('productDetails.notFound')}</p>;
  }

  if (error) {
    return <div className="page-content" />;
  }

  const handleDelete = async () => {
    if (!product || isDeleting) {
      return;
    }

    const confirmed = window.confirm(t('productDetails.deleteConfirm', { name: product.name }));
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await productsApi.delete(product.id);
      showToast(t('productDetails.toastDeleted'));
      navigate('/products');
    } catch (err) {
      showToast(err.message ?? t('productDetails.toastDeleteError'), { severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-content">
      <header className="section-header detail-header modern-surface">
        <div className="detail-header-top">
          <span className={`detail-badge ${product.isAvailable ? 'is-success' : 'is-muted'}`}>
            <VerifiedRoundedIcon fontSize="inherit" />
            {product.isAvailable ? t('productDetails.available') : t('productDetails.unavailable')}
          </span>
          <span className="detail-badge is-muted">
            <Inventory2RoundedIcon fontSize="inherit" />
            {formatCurrency(product.price)}
          </span>
        </div>

        <h1>{product.name}</h1>
        <p className="muted">{t('productDetails.subtitle')}</p>

        <div className="section-actions detail-actions">
          <Link className="ghost" to="/products">
            <ArrowBackRoundedIcon fontSize="small" />
            {t('productDetails.backToList')}
          </Link>
          {product.shopUrl ? (
            <a className="secondary" href={product.shopUrl} target="_blank" rel="noreferrer">
              <OpenInNewRoundedIcon fontSize="small" />
              {t('productDetails.openShop')}
            </a>
          ) : null}
          <button type="button" className="secondary danger" onClick={handleDelete} disabled={isDeleting}>
            <DeleteOutlineRoundedIcon fontSize="small" />
            {isDeleting ? t('common.deleting') : t('productDetails.delete')}
          </button>
        </div>
      </header>

      <section className="grid detail-grid">
        <article className="card detail-card">
          <h2>{t('productDetails.infoTitle')}</h2>
          <dl className="detail-list">
            <div>
              <dt>{t('productDetails.brandLabel', { value: '' }).trim()}</dt>
              <dd>{product.brand || t('productDetails.noData')}</dd>
            </div>
            <div>
              <dt>{t('productDetails.notesLabel', { value: '' }).trim()}</dt>
              <dd>{product.notes || t('productDetails.noNotes')}</dd>
            </div>
            <div>
              <dt>{t('productDetails.priceLabel', { value: '' }).trim()}</dt>
              <dd>{formatCurrency(product.price)}</dd>
            </div>
            <div>
              <dt>{t('productDetails.shopLabel', { value: '' }).trim()}</dt>
              <dd>{product.shopUrl || t('productDetails.noShopUrl')}</dd>
            </div>
            <div>
              <dt>{t('productDetails.availabilityCheckedAtLabel', { value: '' }).trim()}</dt>
              <dd>
                {product.availabilityCheckedAt
                  ? formatDate(product.availabilityCheckedAt)
                  : t('productDetails.noAvailabilityDate')}
              </dd>
            </div>
          </dl>
        </article>

        <article className="card detail-card media-card">
          <h2>{t('productDetails.imageTitle')}</h2>
          {product.imageUrl ? (
            <img className="product-image detail-main-image" src={toApiAssetUrl(product.imageUrl)} alt={product.name} />
          ) : (
            <p className="muted">{t('productDetails.noImage')}</p>
          )}
        </article>
      </section>
    </div>
  );
}

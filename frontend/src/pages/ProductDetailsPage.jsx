import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useProductDetails from '../hooks/useProductDetails';
import { useToast } from '../components/ToastProvider';
import { productsApi } from '../api';
import { t } from '../utils/i18n';
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

    const confirmed = window.confirm(
      t('productDetails.deleteConfirm', { name: product.name })
    );
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
      <header className="section-header">
        <h1>{product.name}</h1>
        <p className="muted">{t('productDetails.subtitle')}</p>
        <div className="section-actions">
          <Link className="ghost" to="/products">
            {t('productDetails.backToList')}
          </Link>
          <button type="button" className="secondary danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? t('common.deleting') : t('productDetails.delete')}
          </button>
        </div>
      </header>

      <section className="grid">
        <article className="card">
          <h2>{t('productDetails.infoTitle')}</h2>
          <p>
            {t('productDetails.brandLabel', {
              value: product.brand || t('productDetails.noData'),
            })}
          </p>
          <p>
            {t('productDetails.notesLabel', {
              value: product.notes || t('productDetails.noNotes'),
            })}
          </p>
          <p>
            {t('productDetails.priceLabel', {
              value: formatCurrency(product.price),
            })}
          </p>
          <p>
            {t('productDetails.shopLabel', {
              value: product.shopUrl || t('productDetails.noShopUrl'),
            })}
          </p>
          <p>
            {t('productDetails.availabilityLabel', {
              value: product.isAvailable
                ? t('productDetails.available')
                : t('productDetails.unavailable'),
            })}
          </p>
          <p>
            {t('productDetails.availabilityCheckedAtLabel', {
              value: product.availabilityCheckedAt
                ? formatDate(product.availabilityCheckedAt)
                : t('productDetails.noAvailabilityDate'),
            })}
          </p>
        </article>
        <article className="card">
          <h2>{t('productDetails.imageTitle')}</h2>
          {product.shopUrl ? (
            <p>
              <a href={product.shopUrl} target="_blank" rel="noreferrer">
                {t('productDetails.openShop')}
              </a>
            </p>
          ) : null}
          {product.imageUrl ? (
            <img className="product-image" src={product.imageUrl} alt={product.name} />
          ) : (
            <p className="muted">{t('productDetails.noImage')}</p>
          )}
        </article>
      </section>
    </div>
  );
}

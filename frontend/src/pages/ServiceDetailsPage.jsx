import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useServiceDetails from '../hooks/useServiceDetails';
import useProducts from '../hooks/useProducts';
import { useToast } from '../components/ToastProvider';
import { formatCurrency } from '../utils/formatters';
import { servicesApi } from '../api';
import { t } from '../utils/i18n';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const { service, isLoading, error, reload } = useServiceDetails(id);
  const { products } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const availableProducts = useMemo(() => {
    if (!service) {
      return [];
    }

    const assignedIds = new Set((service.requiredProducts ?? []).map((product) => product.id));
    return products.filter((product) => !assignedIds.has(product.id));
  }, [products, service]);

  useEffect(() => {
    if (error) {
      showToast(error, { severity: 'error' });
    }
  }, [error, showToast]);

  if (isLoading) {
    return <p className="card muted">{t('serviceDetails.loading')}</p>;
  }

  if (!service && !error) {
    return <p className="card muted">{t('serviceDetails.notFound')}</p>;
  }

  if (error) {
    return <div className="page-content" />;
  }

  const handleDelete = async () => {
    if (!service || isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      t('serviceDetails.deleteConfirm', { name: service.name })
    );
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await servicesApi.delete(service.id);
      showToast(t('serviceDetails.toastDeleted'));
      navigate('/services');
    } catch (err) {
      showToast(err.message ?? t('serviceDetails.toastDeleteError'), { severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProductId || isAddingProduct) {
      return;
    }

    setIsAddingProduct(true);
    try {
      await servicesApi.addProduct(service.id, selectedProductId);
      showToast(t('serviceDetails.toastProductAdded'));
      setSelectedProductId('');
      await reload();
    } catch (err) {
      showToast(err.message ?? t('serviceDetails.toastProductAddError'), { severity: 'error' });
    } finally {
      setIsAddingProduct(false);
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{service.name}</h1>
        <p className="muted">{t('serviceDetails.subtitle')}</p>
        <div className="section-actions">
          <Link className="ghost" to="/services">
            {t('serviceDetails.backToList')}
          </Link>
          <button type="button" className="secondary danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? t('common.deleting') : t('serviceDetails.delete')}
          </button>
        </div>
      </header>

      <section className="grid">
        <article className="card">
          <h2>{t('serviceDetails.descriptionTitle')}</h2>
          <p>{service.description || t('serviceDetails.noDescription')}</p>
          <p>{t('serviceDetails.durationLabel', { value: service.duration })}</p>
          <p>{t('serviceDetails.priceLabel', { value: formatCurrency(service.price) })}</p>
        </article>
        <article className="card">
          <h2>{t('serviceDetails.requiredProductsTitle')}</h2>
          {service.requiredProducts?.length ? (
            <ul className="list stacked">
              {service.requiredProducts.map((product) => (
                <li key={product.id}>
                  <span className="list-title">{product.name}</span>
                  <span className="muted">{product.brand || t('serviceDetails.noBrand')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t('serviceDetails.noProducts')}</p>
          )}

          <div className="stack" style={{ marginTop: '1rem' }}>
            <label>
              {t('serviceDetails.addProductLabel')}
              <select
                value={selectedProductId}
                onChange={(event) => setSelectedProductId(event.target.value)}
              >
                <option value="">{t('serviceDetails.addProductPlaceholder')}</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="primary"
              onClick={handleAddProduct}
              disabled={!selectedProductId || isAddingProduct}
            >
              {isAddingProduct ? t('common.saving') : t('serviceDetails.addProductButton')}
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

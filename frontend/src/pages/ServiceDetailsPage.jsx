import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import useServiceDetails from '../hooks/useServiceDetails';
import useProducts from '../hooks/useProducts';
import { useToast } from '../components/ToastProvider';
import { formatCurrencyRange } from '../utils/formatters';
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

    const confirmed = window.confirm(t('serviceDetails.deleteConfirm', { name: service.name }));
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
      <header className="section-header detail-header modern-surface">
        <div className="detail-header-top">
          <span className="detail-badge">
            {t(`serviceTypes.${service.type ?? 'OnSite'}`)}
          </span>
          <span className="detail-badge is-muted">
            <ConstructionRoundedIcon fontSize="inherit" />
            {t('serviceDetails.durationLabel', { value: service.duration })}
          </span>
          <span className="detail-badge is-accent">
            {formatCurrencyRange(service.priceFrom, service.priceTo)}
          </span>
        </div>
        <h1>{service.name}</h1>
        <p className="muted">{t('serviceDetails.subtitle')}</p>
        <div className="section-actions detail-actions">
          <Link className="ghost" to="/services">
            <ArrowBackRoundedIcon fontSize="small" />
            {t('serviceDetails.backToList')}
          </Link>
          <button type="button" className="secondary danger" onClick={handleDelete} disabled={isDeleting}>
            <DeleteOutlineRoundedIcon fontSize="small" />
            {isDeleting ? t('common.deleting') : t('serviceDetails.delete')}
          </button>
        </div>
      </header>

      <section className="grid detail-grid">
        <article className="card detail-card">
          <h2>{t('serviceDetails.descriptionTitle')}</h2>
          <p>{service.description || t('serviceDetails.noDescription')}</p>
          <p>{t('serviceDetails.typeLabel', { value: t(`serviceTypes.${service.type ?? 'OnSite'}`) })}</p>
          <p>{t('serviceDetails.durationLabel', { value: service.duration })}</p>
          <p>{t('serviceDetails.priceLabel', { value: formatCurrencyRange(service.priceFrom, service.priceTo) })}</p>
        </article>

        <article className="card detail-card">
          <h2>{t('serviceDetails.requiredProductsTitle')}</h2>
          {service.requiredProducts?.length ? (
            <ul className="list stacked detail-stack-list">
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

          <div className="stack detail-inline-form" style={{ marginTop: '1rem' }}>
            <label>
              {t('serviceDetails.addProductLabel')}
              <select value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)}>
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
              <PlaylistAddRoundedIcon fontSize="small" />
              {isAddingProduct ? t('common.saving') : t('serviceDetails.addProductButton')}
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

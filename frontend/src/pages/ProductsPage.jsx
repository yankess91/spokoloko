import { useCallback, useEffect, useMemo, useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import Modal from '../components/Modal';
import useProducts from '../hooks/useProducts';
import { useToast } from '../components/ToastProvider';
import AddIcon from '@mui/icons-material/Add';
import { t } from '../utils/i18n';

export default function ProductsPage() {
  const { products, isLoading, error, addProduct, removeProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  const showError = useCallback(
    (message) => showToast(message, { severity: 'error' }),
    [showToast]
  );

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await addProduct(payload);
      showToast(t('productsPage.toastSaved'));
      setIsModalOpen(false);
    } catch (err) {
      showError(err.message ?? t('productsPage.toastSaveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(t('productsPage.deleteConfirm', { name: product.name }))) {
      return;
    }
    try {
      await removeProduct(product.id);
      showToast(t('productsPage.toastDeleted'));
    } catch (err) {
      showError(err.message ?? t('productsPage.toastDeleteError'));
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{t('productsPage.title')}</h1>
        <p className="muted">{t('productsPage.subtitle')}</p>
      </header>

      <section className="stack">
        <article className="card">
          <header className="card-header">
            <div>
              <h2>{t('productsPage.listTitle')}</h2>
              <p className="muted">{t('productsPage.listSubtitle')}</p>
            </div>
          </header>
          <div className="grid-actions">
            <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
              <AddIcon fontSize="small" />
              {t('productsPage.newProduct')}
            </button>
          </div>
          <ProductList
            products={sortedProducts}
            isLoading={isLoading}
            linkBase="/products"
            onDelete={handleDelete}
          />
        </article>
      </section>

      {isModalOpen ? (
        <Modal title={t('productsPage.modalTitle')} onClose={() => setIsModalOpen(false)}>
          <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} showTitle={false} variant="plain" />
        </Modal>
      ) : null}
    </div>
  );
}

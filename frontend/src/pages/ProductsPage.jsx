import { useCallback, useEffect, useMemo, useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import Modal from '../components/Modal';
import useProducts from '../hooks/useProducts';
import { useToast } from '../components/ToastProvider';
import AddIcon from '@mui/icons-material/Add';

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
      showToast('Produkt został zapisany.');
      setIsModalOpen(false);
    } catch (err) {
      showError(err.message ?? 'Nie udało się zapisać produktu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć produkt "${product.name}"?`)) {
      return;
    }
    try {
      await removeProduct(product.id);
      showToast('Produkt został usunięty.');
    } catch (err) {
      showError(err.message ?? 'Nie udało się usunąć produktu.');
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>Produkty</h1>
        <p className="muted">Dodawaj produkty pielęgnacyjne i śledź ich zastosowanie.</p>
      </header>

      <section className="stack">
        <article className="card">
          <header className="card-header">
            <div>
              <h2>Lista produktów</h2>
              <p className="muted">Przeglądaj i edytuj produkty dostępne w salonie.</p>
            </div>
          </header>
          <div className="grid-actions">
            <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
              <AddIcon fontSize="small" />
              Nowy produkt
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
        <Modal title="Nowy produkt" onClose={() => setIsModalOpen(false)}>
          <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} showTitle={false} variant="plain" />
        </Modal>
      ) : null}
    </div>
  );
}

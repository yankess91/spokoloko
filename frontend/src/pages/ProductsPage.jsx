import { useCallback, useEffect, useMemo, useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import useProducts from '../hooks/useProducts';
import { useToast } from '../components/ToastProvider';

export default function ProductsPage() {
  const { products, isLoading, error, addProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    } catch (err) {
      showError(err.message ?? 'Nie udało się zapisać produktu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>Produkty</h1>
        <p className="muted">Dodawaj produkty pielęgnacyjne i śledź ich zastosowanie.</p>
      </header>

      <section className="grid">
        <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        <div className="stack">
          <ProductList products={sortedProducts} isLoading={isLoading} linkBase="/products" />
        </div>
      </section>
    </div>
  );
}

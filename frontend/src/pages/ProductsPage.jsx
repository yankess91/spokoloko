import { useMemo, useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import useProducts from '../hooks/useProducts';

export default function ProductsPage() {
  const { products, isLoading, error, addProduct } = useProducts();
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');
    try {
      await addProduct(payload);
      setSuccessMessage('Produkt został zapisany.');
    } catch (err) {
      setFormError(err.message ?? 'Nie udało się zapisać produktu.');
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
          {formError ? <p className="card error">{formError}</p> : null}
          {successMessage ? <p className="card success">{successMessage}</p> : null}
          {error ? <p className="card error">{error}</p> : null}
          <ProductList products={sortedProducts} isLoading={isLoading} linkBase="/products" />
        </div>
      </section>
    </div>
  );
}

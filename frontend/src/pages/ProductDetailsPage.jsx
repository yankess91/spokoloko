import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useProductDetails from '../hooks/useProductDetails';
import { useToast } from '../components/ToastProvider';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { product, isLoading, error } = useProductDetails(id);
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, { severity: 'error' });
    }
  }, [error, showToast]);

  if (isLoading) {
    return <p className="card muted">Ładowanie produktu...</p>;
  }

  if (!product && !error) {
    return <p className="card muted">Nie znaleziono produktu.</p>;
  }

  if (error) {
    return <div className="page-content" />;
  }

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{product.name}</h1>
        <p className="muted">Szczegóły produktu pielęgnacyjnego.</p>
        <Link className="ghost" to="/products">
          Wróć do listy
        </Link>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Informacje</h2>
          <p>Marka: {product.brand || 'Brak danych'}</p>
          <p>Notatki: {product.notes || 'Brak notatek'}</p>
        </article>
        <article className="card">
          <h2>Zdjęcie produktu</h2>
          {product.imageUrl ? (
            <img className="product-image" src={product.imageUrl} alt={product.name} />
          ) : (
            <p className="muted">Brak zdjęcia.</p>
          )}
        </article>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useProductDetails from '../hooks/useProductDetails';
import { useToast } from '../components/ToastProvider';
import { productsApi } from '../api';

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
    return <p className="card muted">Ładowanie produktu...</p>;
  }

  if (!product && !error) {
    return <p className="card muted">Nie znaleziono produktu.</p>;
  }

  if (error) {
    return <div className="page-content" />;
  }

  const handleDelete = async () => {
    if (!product || isDeleting) {
      return;
    }

    const confirmed = window.confirm(`Czy na pewno chcesz usunąć produkt: ${product.name}?`);
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await productsApi.delete(product.id);
      showToast('Produkt został usunięty.');
      navigate('/products');
    } catch (err) {
      showToast(err.message ?? 'Nie udało się usunąć produktu.', { severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{product.name}</h1>
        <p className="muted">Szczegóły produktu pielęgnacyjnego.</p>
        <div className="section-actions">
          <Link className="ghost" to="/products">
            Wróć do listy
          </Link>
          <button type="button" className="secondary danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Usuwanie...' : 'Usuń produkt'}
          </button>
        </div>
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

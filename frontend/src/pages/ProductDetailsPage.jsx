import { Link, useParams } from 'react-router-dom';
import useProductDetails from '../hooks/useProductDetails';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { product, isLoading, error } = useProductDetails(id);

  if (isLoading) {
    return <p className="card muted">Ładowanie produktu...</p>;
  }

  if (error) {
    return <p className="card error">{error}</p>;
  }

  if (!product) {
    return <p className="card muted">Nie znaleziono produktu.</p>;
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
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function ProductList({ products, isLoading, linkBase }) {
  if (isLoading) {
    return <p className="muted">Ładowanie produktów...</p>;
  }

  if (products.length === 0) {
    return <p className="muted">Brak produktów do wyświetlenia.</p>;
  }

  return (
    <div className="data-grid data-grid-products" role="table" aria-label="Lista produktów">
      <div className="data-grid-row data-grid-header" role="row">
        <span className="data-grid-cell" role="columnheader">
          Produkt
        </span>
        <span className="data-grid-cell" role="columnheader">
          Marka
        </span>
        <span className="data-grid-cell" role="columnheader">
          Zdjęcie
        </span>
        <span className="data-grid-cell" role="columnheader">
          Akcje
        </span>
      </div>
      {products.map((product) => (
        <div key={product.id} className="data-grid-row" role="row">
          <div className="data-grid-cell" role="cell">
            <div className="data-grid-title">{product.name}</div>
            <div className="data-grid-meta">{product.notes || 'Brak notatek'}</div>
          </div>
          <div className="data-grid-cell" role="cell">
            {product.brand || 'Brak marki'}
          </div>
          <div className="data-grid-cell" role="cell">
            {product.imageUrl ? (
              <img className="thumb" src={product.imageUrl} alt={product.name} />
            ) : (
              <span className="data-grid-meta">Brak zdjęcia</span>
            )}
          </div>
          <div className="data-grid-cell data-grid-actions" role="cell">
            {linkBase ? (
              <Link className="ghost" to={`${linkBase}/${product.id}`}>
                Szczegóły
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

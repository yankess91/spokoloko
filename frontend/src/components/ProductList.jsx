import { Link } from 'react-router-dom';

export default function ProductList({ products, isLoading, linkBase }) {
  return (
    <article className="card">
      <header className="card-header">
        <h2>Wszystkie produkty</h2>
      </header>
      {isLoading ? (
        <p className="muted">Ładowanie produktów...</p>
      ) : products.length === 0 ? (
        <p className="muted">Brak produktów do wyświetlenia.</p>
      ) : (
        <ul className="list">
          {products.map((product) => (
            <li key={product.id} className="list-item">
              <div className="list-item-main">
                {linkBase ? (
                  <Link className="list-title" to={`${linkBase}/${product.id}`}>
                    {product.name}
                  </Link>
                ) : (
                  <span className="list-title">{product.name}</span>
                )}
                <span className="list-meta">{product.brand || 'Brak marki'}</span>
              </div>
              {product.imageUrl ? (
                <img className="thumb" src={product.imageUrl} alt={product.name} />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

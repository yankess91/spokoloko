import { Link } from 'react-router-dom';

export default function ProductList({ products, isLoading, linkBase }) {
  return (
    <article className="card">
      <h2>Wszystkie produkty</h2>
      {isLoading ? (
        <p className="muted">Ładowanie produktów...</p>
      ) : products.length === 0 ? (
        <p className="muted">Brak produktów do wyświetlenia.</p>
      ) : (
        <ul className="list">
          {products.map((product) => (
            <li key={product.id}>
              {linkBase ? (
                <Link className="list-title" to={`${linkBase}/${product.id}`}>
                  {product.name}
                </Link>
              ) : (
                <span className="list-title">{product.name}</span>
              )}
              <span className="muted">{product.brand}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function ProductList({ products, isLoading }) {
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
              <span>{product.name}</span>
              <span className="muted">{product.brand}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="ghost">Dodaj produkt</button>
    </article>
  );
}

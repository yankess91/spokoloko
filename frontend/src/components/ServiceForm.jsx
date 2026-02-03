import { useMemo, useState } from 'react';

const buildProductLabel = (product) =>
  product.brand ? `${product.name} (${product.brand})` : product.name;

export default function ServiceForm({ products = [], onSubmit, isSubmitting }) {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    durationMinutes: 60,
    price: '',
    productInput: '',
    selectedProducts: []
  });
  const [error, setError] = useState('');

  const productLabels = useMemo(
    () => products.map((product) => ({ id: product.id, label: buildProductLabel(product) })),
    [products]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    setError('');
    const match = productLabels.find((product) => product.label === formState.productInput);
    if (!match) {
      setError('Wybierz produkt z listy podpowiedzi.');
      return;
    }
    if (formState.selectedProducts.some((item) => item.id === match.id)) {
      setError('Ten produkt został już dodany.');
      return;
    }
    setFormState((prev) => ({
      ...prev,
      productInput: '',
      selectedProducts: [...prev.selectedProducts, match]
    }));
  };

  const handleRemoveProduct = (productId) => {
    setFormState((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter((item) => item.id !== productId)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit?.({
      name: formState.name,
      description: formState.description,
      durationMinutes: Number(formState.durationMinutes),
      price: Number(formState.price),
      requiredProductIds: formState.selectedProducts.map((item) => item.id)
    });
    setFormState({
      name: '',
      description: '',
      durationMinutes: 60,
      price: '',
      productInput: '',
      selectedProducts: []
    });
    setError('');
  };

  return (
    <article className="card">
      <h2>Dodaj usługę</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nazwa usługi
          <input
            name="name"
            placeholder="np. Warkocze klasyczne"
            value={formState.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Opis
          <textarea
            name="description"
            placeholder="Krótki opis zabiegu"
            rows="3"
            value={formState.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Czas trwania (min)
          <input
            name="durationMinutes"
            type="number"
            min="15"
            step="5"
            value={formState.durationMinutes}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Cena (PLN)
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="np. 250"
            value={formState.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Produkty wymagane
          <div className="inline-field">
            <input
              name="productInput"
              list="service-products"
              placeholder="Wybierz produkt"
              value={formState.productInput}
              onChange={handleChange}
            />
            <button type="button" className="secondary" onClick={handleAddProduct}>
              Dodaj
            </button>
          </div>
          <datalist id="service-products">
            {productLabels.map((product) => (
              <option key={product.id} value={product.label} />
            ))}
          </datalist>
        </label>
        {error ? <p className="error-note">{error}</p> : null}
        {formState.selectedProducts.length ? (
          <div className="chips">
            {formState.selectedProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className="chip chip-button"
                onClick={() => handleRemoveProduct(product.id)}
              >
                {product.label} ✕
              </button>
            ))}
          </div>
        ) : (
          <p className="muted">Brak przypiętych produktów.</p>
        )}
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz usługę'}
        </button>
      </form>
    </article>
  );
}

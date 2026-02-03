import { useMemo, useState } from 'react';
import { productsApi } from '../api';
import useAutocompleteSearch from '../hooks/useAutocompleteSearch';
import AutocompleteField from './AutocompleteField';

const buildProductLabel = (product) =>
  product.brand ? `${product.name} (${product.brand})` : product.name;

export default function ServiceForm({ onSubmit, isSubmitting }) {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    durationMinutes: 60,
    price: '',
    selectedProducts: []
  });
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productSearch = useAutocompleteSearch({
    searchFn: (query) => productsApi.search(query)
  });

  const productOptions = useMemo(
    () =>
      productSearch.options.map((product) => ({
        id: product.id,
        label: buildProductLabel(product)
      })),
    [productSearch.options]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    setError('');
    if (!selectedProduct) {
      setError('Wybierz produkt z listy podpowiedzi.');
      return;
    }
    if (formState.selectedProducts.some((item) => item.id === selectedProduct.id)) {
      setError('Ten produkt został już dodany.');
      return;
    }
    setFormState((prev) => ({
      ...prev,
      selectedProducts: [...prev.selectedProducts, selectedProduct]
    }));
    setSelectedProduct(null);
    productSearch.setInputValue('');
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
      selectedProducts: []
    });
    setError('');
    setSelectedProduct(null);
    productSearch.setInputValue('');
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
            <AutocompleteField
              label="Produkty wymagane"
              placeholder="Wybierz produkt"
              options={productOptions}
              value={selectedProduct}
              inputValue={productSearch.inputValue}
              onChange={(_, newValue) => setSelectedProduct(newValue)}
              onInputChange={(_, newValue) => productSearch.setInputValue(newValue)}
              loading={productSearch.isLoading}
              disabled={isSubmitting}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              hideLabel
              containerClassName="autocomplete-inline"
            />
            <button type="button" className="secondary" onClick={handleAddProduct}>
              Dodaj
            </button>
          </div>
        </label>
        {error ? <p className="error-note">{error}</p> : null}
        {productSearch.error ? <p className="error-note">{productSearch.error}</p> : null}
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

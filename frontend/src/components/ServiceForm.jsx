import { useCallback, useEffect, useMemo, useState } from 'react';
import { productsApi } from '../api';
import useAutocompleteSearch from '../hooks/useAutocompleteSearch';
import AutocompleteField from './AutocompleteField';
import { useToast } from './ToastProvider';

const buildProductLabel = (product) =>
  product.brand ? `${product.name} (${product.brand})` : product.name;

export default function ServiceForm({ onSubmit, isSubmitting, showTitle = true, variant = 'card' }) {
  const { showToast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    durationMinutes: 60,
    price: '',
    selectedProducts: []
  });
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

  const showError = useCallback(
    (message) => showToast(message, { severity: 'error' }),
    [showToast]
  );

  useEffect(() => {
    if (productSearch.error) {
      showError(productSearch.error);
    }
  }, [productSearch.error, showError]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    if (!selectedProduct) {
      showError('Wybierz produkt z listy podpowiedzi.');
      return;
    }
    if (formState.selectedProducts.some((item) => item.id === selectedProduct.id)) {
      showError('Ten produkt został już dodany.');
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
    setSelectedProduct(null);
    productSearch.setInputValue('');
  };

  const formContent = (
    <>
      {showTitle ? <h2>Dodaj usługę</h2> : null}
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
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              hideLabel
              containerClassName="autocomplete-inline"
            />
            <button type="button" className="secondary" onClick={handleAddProduct}>
              Dodaj
            </button>
          </div>
        </label>
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
    </>
  );

  if (variant === 'card') {
    return <article className="card">{formContent}</article>;
  }

  return <div>{formContent}</div>;
}

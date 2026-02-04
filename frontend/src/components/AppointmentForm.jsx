import { useCallback, useEffect, useMemo, useState } from 'react';
import { clientsApi, productsApi, servicesApi } from '../api';
import useAutocompleteSearch from '../hooks/useAutocompleteSearch';
import AutocompleteField from './AutocompleteField';
import { useToast } from './ToastProvider';

const buildClientLabel = (client) => client.fullName;
const buildServiceLabel = (service) => service.name;
const buildProductLabel = (product) =>
  product.brand ? `${product.name} (${product.brand})` : product.name;

export default function AppointmentForm({
  onSubmit,
  isSubmitting,
  defaultClient,
  clientLocked = false,
  showTitle = true,
  variant = 'card'
}) {
  const { showToast } = useToast();
  const [formState, setFormState] = useState({
    startAt: '',
    endAt: '',
    notes: '',
    selectedProducts: []
  });
  const [selectedClient, setSelectedClient] = useState(defaultClient ?? null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const clientSearch = useAutocompleteSearch({
    searchFn: (query) => clientsApi.search(query),
    loadOnEmpty: true
  });
  const serviceSearch = useAutocompleteSearch({
    searchFn: (query) => servicesApi.search(query),
     loadOnEmpty: true
  });
  const productSearch = useAutocompleteSearch({
    searchFn: (query) => productsApi.search(query),
     loadOnEmpty: true
  });

  const clientOptions = useMemo(
    () => clientSearch.options.map((client) => ({ id: client.id, label: buildClientLabel(client) })),
    [clientSearch.options]
  );
  const serviceOptions = useMemo(
    () =>
      serviceSearch.options.map((service) => ({ id: service.id, label: buildServiceLabel(service) })),
    [serviceSearch.options]
  );
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
    const errorMessage = clientSearch.error || serviceSearch.error || productSearch.error;
    if (errorMessage) {
      showError(errorMessage);
    }
  }, [clientSearch.error, productSearch.error, serviceSearch.error, showError]);

  useEffect(() => {
    if (defaultClient) {
      setSelectedClient(defaultClient);
      clientSearch.setInputValue(defaultClient.label ?? '');
    }
  }, [defaultClient, clientSearch]);

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
    if (!selectedClient || !selectedService) {
      showError('Wybierz klientkę i usługę z listy podpowiedzi.');
      return;
    }
    await onSubmit?.({
      clientId: selectedClient.id,
      serviceId: selectedService.id,
      startAt: new Date(formState.startAt).toISOString(),
      endAt: new Date(formState.endAt).toISOString(),
      notes: formState.notes,
      productIds: formState.selectedProducts.map((product) => product.id)
    });
    setFormState({
      startAt: '',
      endAt: '',
      notes: '',
      selectedProducts: []
    });
    if (!clientLocked) {
      setSelectedClient(null);
      clientSearch.setInputValue('');
    }
    setSelectedService(null);
    setSelectedProduct(null);
    serviceSearch.setInputValue('');
    productSearch.setInputValue('');
  };

  const formContent = (
    <>
      {showTitle ? <h2>Zaplanuj wizytę</h2> : null}
      <form className="form" onSubmit={handleSubmit}>
        {clientLocked ? (
          <label>
            Klientka
            <input
              type="text"
              value={selectedClient?.label ?? ''}
              disabled
              aria-disabled="true"
            />
          </label>
        ) : (
          <AutocompleteField
            label="Klientka"
            placeholder="Wybierz klientkę"
            options={clientOptions}
            value={selectedClient}
            inputValue={clientSearch.inputValue}
            onChange={(_, newValue) => setSelectedClient(newValue)}
            onInputChange={(_, newValue) => clientSearch.setInputValue(newValue)}
            loading={clientSearch.isLoading}
            disabled={isSubmitting}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        )}
        <AutocompleteField
          label="Usługa"
          placeholder="Wybierz usługę"
          options={serviceOptions}
          value={selectedService}
          inputValue={serviceSearch.inputValue}
          onChange={(_, newValue) => setSelectedService(newValue)}
          onInputChange={(_, newValue) => serviceSearch.setInputValue(newValue)}
          loading={serviceSearch.isLoading}
          disabled={isSubmitting}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
        />
        <label>
          Start wizyty
          <input
            name="startAt"
            type="datetime-local"
            value={formState.startAt}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Koniec wizyty
          <input
            name="endAt"
            type="datetime-local"
            value={formState.endAt}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Notatki
          <textarea
            name="notes"
            placeholder="Uwagi do wizyty"
            rows="3"
            value={formState.notes}
            onChange={handleChange}
          />
        </label>
        <div className="form-field">
          <span className="form-label">Produkty użyte</span>
          <div className="inline-field">
            <AutocompleteField
              label="Produkty użyte"
              placeholder="Dodaj produkt"
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
        </div>
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
          <p className="muted">Brak zapisanych produktów.</p>
        )}
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz wizytę'}
        </button>
      </form>
    </>
  );

  if (variant === 'card') {
    return <article className="card">{formContent}</article>;
  }

  return <div>{formContent}</div>;
}

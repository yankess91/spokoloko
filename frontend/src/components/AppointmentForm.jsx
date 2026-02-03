import { useMemo, useState } from 'react';

const buildClientLabel = (client) => client.fullName;
const buildServiceLabel = (service) => service.name;
const buildProductLabel = (product) =>
  product.brand ? `${product.name} (${product.brand})` : product.name;

export default function AppointmentForm({
  clients = [],
  services = [],
  products = [],
  onSubmit,
  isSubmitting
}) {
  const [formState, setFormState] = useState({
    clientId: '',
    serviceId: '',
    clientInput: '',
    serviceInput: '',
    startAt: '',
    endAt: '',
    notes: '',
    productInput: '',
    selectedProducts: []
  });
  const [error, setError] = useState('');

  const clientLabels = useMemo(
    () => clients.map((client) => ({ id: client.id, label: buildClientLabel(client) })),
    [clients]
  );
  const serviceLabels = useMemo(
    () => services.map((service) => ({ id: service.id, label: buildServiceLabel(service) })),
    [services]
  );
  const productLabels = useMemo(
    () => products.map((product) => ({ id: product.id, label: buildProductLabel(product) })),
    [products]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (event) => {
    const { value } = event.target;
    const match = clientLabels.find((client) => client.label === value);
    setFormState((prev) => ({
      ...prev,
      clientInput: value,
      clientId: match?.id ?? ''
    }));
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;
    const match = serviceLabels.find((service) => service.label === value);
    setFormState((prev) => ({
      ...prev,
      serviceInput: value,
      serviceId: match?.id ?? ''
    }));
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
    if (!formState.clientId || !formState.serviceId) {
      setError('Wybierz klientkę i usługę z listy podpowiedzi.');
      return;
    }
    setError('');
    await onSubmit?.({
      clientId: formState.clientId,
      serviceId: formState.serviceId,
      startAt: new Date(formState.startAt).toISOString(),
      endAt: new Date(formState.endAt).toISOString(),
      notes: formState.notes,
      productIds: formState.selectedProducts.map((product) => product.id)
    });
    setFormState({
      clientId: '',
      serviceId: '',
      clientInput: '',
      serviceInput: '',
      startAt: '',
      endAt: '',
      notes: '',
      productInput: '',
      selectedProducts: []
    });
  };

  return (
    <article className="card">
      <h2>Zaplanuj wizytę</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Klientka
          <input
            name="clientInput"
            list="client-options"
            placeholder="Wybierz klientkę"
            value={formState.clientInput}
            onChange={handleClientChange}
            required
          />
          <datalist id="client-options">
            {clientLabels.map((client) => (
              <option key={client.id} value={client.label} />
            ))}
          </datalist>
        </label>
        <label>
          Usługa
          <input
            name="serviceInput"
            list="service-options"
            placeholder="Wybierz usługę"
            value={formState.serviceInput}
            onChange={handleServiceChange}
            required
          />
          <datalist id="service-options">
            {serviceLabels.map((service) => (
              <option key={service.id} value={service.label} />
            ))}
          </datalist>
        </label>
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
        <label>
          Produkty użyte
          <div className="inline-field">
            <input
              name="productInput"
              list="appointment-products"
              placeholder="Dodaj produkt"
              value={formState.productInput}
              onChange={handleChange}
            />
            <button type="button" className="secondary" onClick={handleAddProduct}>
              Dodaj
            </button>
          </div>
          <datalist id="appointment-products">
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
          <p className="muted">Brak zapisanych produktów.</p>
        )}
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz wizytę'}
        </button>
      </form>
    </article>
  );
}

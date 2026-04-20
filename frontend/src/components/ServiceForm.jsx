import { useCallback, useEffect, useMemo, useState } from 'react';
import { productsApi } from '../api';
import useAutocompleteSearch from '../hooks/useAutocompleteSearch';
import AutocompleteField from './AutocompleteField';
import { useToast } from './ToastProvider';
import { t } from '../utils/i18n';

const buildProductLabel = (product) =>
  product.brand ? `${product.name} (${product.brand})` : product.name;

const mapSelectedProducts = (products = []) =>
  products.map((product) => ({
    id: product.id,
    label: product.label ?? buildProductLabel(product)
  }));

const createInitialState = (initialValues) => {
  const values = initialValues ?? {};

  return ({
    name: values.name ?? '',
    description: values.description ?? '',
    type: values.type ?? 'OnSite',
    durationFromMinutes: values.durationFromMinutes ?? values.durationMinutes ?? 60,
    durationToMinutes: values.durationToMinutes ?? values.durationMinutes ?? 60,
    priceFrom: values.priceFrom ?? values.price ?? '',
    priceTo: values.priceTo ?? values.price ?? '',
    selectedProducts: mapSelectedProducts(
      values.selectedProducts ?? values.requiredProducts ?? []
    )
  });
};

export default function ServiceForm({
  onSubmit,
  isSubmitting,
  initialValues,
  showTitle = true,
  variant = 'card'
}) {
  const { showToast } = useToast();
  const [formState, setFormState] = useState(() => createInitialState(initialValues));
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productSearch = useAutocompleteSearch({
    searchFn: (query) => productsApi.search(query)
  });

  useEffect(() => {
    setFormState(createInitialState(initialValues));
    setSelectedProduct(null);
    productSearch.setInputValue('');
  }, [initialValues, productSearch.setInputValue]);

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
      showError(t('serviceForm.selectProductError'));
      return;
    }
    if (formState.selectedProducts.some((item) => item.id === selectedProduct.id)) {
      showError(t('serviceForm.duplicateProductError'));
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
    if (Number(formState.durationToMinutes) < Number(formState.durationFromMinutes)) {
      showError(t('serviceForm.durationRangeError'));
      return;
    }

    if (Number(formState.priceTo) < Number(formState.priceFrom)) {
      showError(t('serviceForm.priceRangeError'));
      return;
    }

    const shouldReset = await onSubmit?.({
      name: formState.name,
      description: formState.description,
      durationFromMinutes: Number(formState.durationFromMinutes),
      durationToMinutes: Number(formState.durationToMinutes),
      priceFrom: Number(formState.priceFrom),
      priceTo: Number(formState.priceTo),
      type: formState.type,
      requiredProductIds: formState.selectedProducts.map((item) => item.id)
    });

    if (shouldReset !== false) {
      setFormState(createInitialState());
      setSelectedProduct(null);
      productSearch.setInputValue('');
    }
  };

  const formContent = (
    <>
      {showTitle ? <h2>{initialValues ? t('serviceForm.editTitle') : t('serviceForm.title')}</h2> : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          {t('serviceForm.name')}
          <input
            name="name"
            placeholder={t('serviceForm.namePlaceholder')}
            value={formState.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          {t('serviceForm.description')}
          <textarea
            name="description"
            placeholder={t('serviceForm.descriptionPlaceholder')}
            rows="3"
            value={formState.description}
            onChange={handleChange}
          />
        </label>
        <label>
          {t('serviceForm.type')}
          <select
            name="type"
            value={formState.type}
            onChange={handleChange}
            required
          >
            <option value="OnSite">{t('serviceForm.types.onSite')}</option>
            <option value="CustomOrder">{t('serviceForm.types.customOrder')}</option>
          </select>
        </label>
        <label>
          {t('serviceForm.duration')}
          <div className="inline-field">
            <input
              name="durationFromMinutes"
              type="number"
              min="15"
              step="5"
              value={formState.durationFromMinutes}
              onChange={handleChange}
              required
            />
            <span className="muted">-</span>
            <input
              name="durationToMinutes"
              type="number"
              min="15"
              step="5"
              value={formState.durationToMinutes}
              onChange={handleChange}
              required
            />
          </div>
        </label>
        <label>
          {t('serviceForm.price')}
          <div className="inline-field">
            <input
              name="priceFrom"
              type="number"
              min="0"
              step="0.01"
              placeholder={t('serviceForm.priceFromPlaceholder')}
              value={formState.priceFrom}
              onChange={handleChange}
              required
            />
            <span className="muted">-</span>
            <input
              name="priceTo"
              type="number"
              min="0"
              step="0.01"
              placeholder={t('serviceForm.priceToPlaceholder')}
              value={formState.priceTo}
              onChange={handleChange}
              required
            />
          </div>
        </label>
        <label>
          {t('serviceForm.requiredProducts')}
          <div className="inline-field">
            <AutocompleteField
              label={t('serviceForm.requiredProducts')}
              placeholder={t('serviceForm.selectProductPlaceholder')}
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
              {t('common.add')}
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
                {t('serviceForm.removeProduct', { label: product.label })}
              </button>
            ))}
          </div>
        ) : (
          <p className="muted">{t('serviceForm.noProducts')}</p>
        )}
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting
            ? t('common.saving')
            : initialValues
            ? t('serviceForm.update')
            : t('serviceForm.save')}
        </button>
      </form>
    </>
  );

  if (variant === 'card') {
    return <article className="card">{formContent}</article>;
  }

  return <div>{formContent}</div>;
}

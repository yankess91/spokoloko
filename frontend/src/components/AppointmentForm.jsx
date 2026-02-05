import { useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { clientsApi, productsApi, servicesApi } from '../api';
import useAutocompleteSearch from '../hooks/useAutocompleteSearch';
import AutocompleteField from './AutocompleteField';
import { useToast } from './ToastProvider';
import { t } from '../utils/i18n';

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
    startAt: null,
    endAt: null,
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

  const handleDateChange = (field) => (newValue) => {
    setFormState((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleAddProduct = () => {
    if (!selectedProduct) {
      showError(t('appointmentForm.selectProductError'));
      return;
    }
    if (formState.selectedProducts.some((item) => item.id === selectedProduct.id)) {
      showError(t('appointmentForm.duplicateProductError'));
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
      showError(t('appointmentForm.selectClientServiceError'));
      return;
    }
    if (!formState.startAt || !formState.endAt) {
      showError(t('appointmentForm.missingDatesError'));
      return;
    }
    await onSubmit?.({
      clientId: selectedClient.id,
      serviceId: selectedService.id,
      startAt: formState.startAt.toISOString(),
      endAt: formState.endAt.toISOString(),
      notes: formState.notes,
      productIds: formState.selectedProducts.map((product) => product.id)
    });
    setFormState({
      startAt: null,
      endAt: null,
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

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#fffdf8',
      '& fieldset': {
        borderColor: '#d7cbb8'
      },
      '&:hover fieldset': {
        borderColor: '#d7cbb8'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#c9a227'
      }
    },
    '& .MuiOutlinedInput-input': {
      padding: '10px 12px',
      fontSize: '14px'
    }
  };

  const formContent = (
    <>
      {showTitle ? <h2>{t('appointmentForm.title')}</h2> : null}
      <form className="form" onSubmit={handleSubmit}>
        {clientLocked ? (
          <label>
            {t('appointmentForm.client')}
            <input
              type="text"
              value={selectedClient?.label ?? ''}
              disabled
              aria-disabled="true"
            />
          </label>
        ) : (
          <AutocompleteField
            label={t('appointmentForm.client')}
            placeholder={t('appointmentForm.selectClientPlaceholder')}
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
          label={t('appointmentForm.service')}
          placeholder={t('appointmentForm.selectServicePlaceholder')}
          options={serviceOptions}
          value={selectedService}
          inputValue={serviceSearch.inputValue}
          onChange={(_, newValue) => setSelectedService(newValue)}
          onInputChange={(_, newValue) => serviceSearch.setInputValue(newValue)}
          loading={serviceSearch.isLoading}
          disabled={isSubmitting}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="datetime-row">
            <DateTimePicker
              label={t('appointmentForm.start')}
              value={formState.startAt}
              onChange={handleDateChange('startAt')}
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  size: 'small',
                  sx: textFieldSx
                }
              }}
            />
            <DateTimePicker
              label={t('appointmentForm.end')}
              value={formState.endAt}
              onChange={handleDateChange('endAt')}
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  size: 'small',
                  sx: textFieldSx
                }
              }}
            />
          </div>
        </LocalizationProvider>
        <label>
          {t('appointmentForm.notes')}
          <textarea
            name="notes"
            placeholder={t('appointmentForm.notesPlaceholder')}
            rows="3"
            value={formState.notes}
            onChange={handleChange}
          />
        </label>
        <div className="form-field">
          <span className="form-label">{t('appointmentForm.usedProducts')}</span>
          <div className="inline-field">
            <AutocompleteField
              label={t('appointmentForm.usedProducts')}
              placeholder={t('appointmentForm.addProductPlaceholder')}
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
              <AddIcon fontSize="small" />
              {t('common.add')}
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
                {t('appointmentForm.removeProduct', { label: product.label })}
              </button>
            ))}
          </div>
        ) : (
          <p className="muted">{t('appointmentForm.noProducts')}</p>
        )}
        <button type="submit" className="primary" disabled={isSubmitting}>
          <SaveIcon fontSize="small" />
          {isSubmitting ? t('common.saving') : t('appointmentForm.save')}
        </button>
      </form>
    </>
  );

  if (variant === 'card') {
    return <article className="card">{formContent}</article>;
  }

  return <div>{formContent}</div>;
}

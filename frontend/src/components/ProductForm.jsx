import { useEffect, useState } from 'react';
import { t } from '../utils/i18n';

const formatDateTimeLocal = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (part) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const createInitialState = (initialValues = {}) => ({
  name: initialValues.name ?? '',
  brand: initialValues.brand ?? '',
  notes: initialValues.notes ?? '',
  imageUrl: initialValues.imageUrl ?? '',
  price: initialValues.price ?? '',
  shopUrl: initialValues.shopUrl ?? '',
  isAvailable: initialValues.isAvailable ?? false,
  availabilityCheckedAt: formatDateTimeLocal(initialValues.availabilityCheckedAt)
});

export default function ProductForm({
  onSubmit,
  isSubmitting,
  initialValues,
  showTitle = true,
  variant = 'card'
}) {
  const [formState, setFormState] = useState(() => createInitialState(initialValues));

  useEffect(() => {
    setFormState(createInitialState(initialValues));
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const shouldReset = await onSubmit?.({
      ...formState,
      price: Number(formState.price) || 0,
      availabilityCheckedAt: formState.availabilityCheckedAt
        ? new Date(formState.availabilityCheckedAt).toISOString()
        : null
    });
    if (shouldReset !== false) {
      setFormState(createInitialState());
    }
  };

  const formContent = (
    <>
      {showTitle ? <h2>{initialValues ? t('productForm.editTitle') : t('productForm.title')}</h2> : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          {t('productForm.name')}
          <input
            name="name"
            placeholder={t('productForm.namePlaceholder')}
            value={formState.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          {t('productForm.brand')}
          <input
            name="brand"
            placeholder={t('productForm.brandPlaceholder')}
            value={formState.brand}
            onChange={handleChange}
          />
        </label>
        <label>
          {t('productForm.notes')}
          <textarea
            name="notes"
            placeholder={t('productForm.notesPlaceholder')}
            rows="3"
            value={formState.notes}
            onChange={handleChange}
          />
        </label>
        <label>
          {t('productForm.imageUrl')}
          <input
            name="imageUrl"
            type="url"
            placeholder={t('productForm.imageUrlPlaceholder')}
            value={formState.imageUrl}
            onChange={handleChange}
          />
        </label>
        <label>
          {t('productForm.price')}
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder={t('productForm.pricePlaceholder')}
            value={formState.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          {t('productForm.shopUrl')}
          <input
            name="shopUrl"
            type="url"
            placeholder={t('productForm.shopUrlPlaceholder')}
            value={formState.shopUrl}
            onChange={handleChange}
          />
        </label>
        <label className="checkbox-field">
          <input
            name="isAvailable"
            type="checkbox"
            checked={formState.isAvailable}
            onChange={handleChange}
          />
          {t('productForm.isAvailable')}
        </label>
        <label>
          {t('productForm.availabilityCheckedAt')}
          <input
            name="availabilityCheckedAt"
            type="datetime-local"
            value={formState.availabilityCheckedAt}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting
            ? t('common.saving')
            : initialValues
            ? t('productForm.update')
            : t('productForm.save')}
        </button>
      </form>
    </>
  );

  if (variant === 'card') {
    return <article className="card">{formContent}</article>;
  }

  return <div>{formContent}</div>;
}

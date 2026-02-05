import { useState } from 'react';
import { t } from '../utils/i18n';

export default function ProductForm({ onSubmit, isSubmitting, showTitle = true, variant = 'card' }) {
  const [formState, setFormState] = useState({
    name: '',
    brand: '',
    notes: '',
    imageUrl: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit?.(formState);
    setFormState({ name: '', brand: '', notes: '', imageUrl: '' });
  };

  const formContent = (
    <>
      {showTitle ? <h2>{t('productForm.title')}</h2> : null}
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
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('productForm.save')}
        </button>
      </form>
    </>
  );

  if (variant === 'card') {
    return <article className="card">{formContent}</article>;
  }

  return <div>{formContent}</div>;
}

import { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { t } from '../utils/i18n';

const createInitialState = (initialValues = {}) => ({
  fullName: initialValues.fullName ?? '',
  email: initialValues.email ?? '',
  phoneNumber: initialValues.phoneNumber ?? '',
  notes: initialValues.notes ?? '',
  isActive: initialValues.isActive ?? true
});

export default function ClientForm({
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
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (event) => {
    const { checked } = event.target;
    setFormState((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const shouldReset = await onSubmit?.(formState);
    if (shouldReset !== false) {
      setFormState(createInitialState());
    }
  };

  const formContent = (
    <>
      {showTitle ? <h2>{initialValues ? t('clientForm.editTitle') : t('clientForm.title')}</h2> : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          {t('clientForm.fullName')}
          <input
            name="fullName"
            placeholder={t('clientForm.fullNamePlaceholder')}
            value={formState.fullName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          {t('clientForm.email')}
          <input
            name="email"
            type="email"
            placeholder={t('clientForm.emailPlaceholder')}
            value={formState.email}
            onChange={handleChange}
          />
        </label>
        <label>
          {t('clientForm.phone')}
          <input
            name="phoneNumber"
            placeholder={t('clientForm.phonePlaceholder')}
            value={formState.phoneNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          {t('clientForm.notes')}
          <textarea
            name="notes"
            placeholder={t('clientForm.notesPlaceholder')}
            rows="3"
            value={formState.notes}
            onChange={handleChange}
          />
        </label>
        <div className="form-field">
          <span className="form-label">{t('clientForm.status')}</span>
          <FormControlLabel
            control={<Switch checked={formState.isActive} onChange={handleStatusChange} />}
            label={
              formState.isActive ? t('clientForm.activeLabel') : t('clientForm.inactiveLabel')
            }
          />
        </div>
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting
            ? t('common.saving')
            : initialValues
            ? t('clientForm.update')
            : t('clientForm.save')}
        </button>
      </form>
    </>
  );

  if (variant === 'card') {
    return <article className="card">{formContent}</article>;
  }

  return <div>{formContent}</div>;
}

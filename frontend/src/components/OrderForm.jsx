import { useEffect, useState } from 'react';
import useClients from '../hooks/useClients';
import OrderItemsEditor from './OrderItemsEditor';
import { t } from '../utils/i18n';

const createInitialState = (initialValues) => ({
  clientId: initialValues?.clientId ?? '',
  title: initialValues?.title ?? '',
  description: initialValues?.description ?? '',
  status: initialValues?.status ?? 'New',
  deliveryMethod: initialValues?.deliveryMethod ?? 'Pickup',
  dueDate: initialValues?.dueDate ?? '',
  items: (initialValues?.items ?? []).map((item) => ({
    name: item.name ?? '',
    notes: item.notes ?? '',
    quantity: item.quantity ?? 1,
    unitPrice: item.unitPrice ?? 0
  }))
});

export default function OrderForm({ onSubmit, isSubmitting, initialValues, showTitle = true, variant = 'card' }) {
  const { clients } = useClients();
  const [formState, setFormState] = useState(createInitialState(initialValues));

  useEffect(() => {
    setFormState(createInitialState(initialValues));
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const shouldReset = await onSubmit?.({
      clientId: formState.clientId,
      title: formState.title,
      description: formState.description,
      status: formState.status,
      deliveryMethod: formState.deliveryMethod,
      dueDate: formState.dueDate || null,
      items: formState.items.map((item) => ({
        name: item.name,
        notes: item.notes,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
      }))
    });

    if (shouldReset !== false && !initialValues) {
      setFormState(createInitialState());
    }
  };

  const content = (
    <>
      {showTitle ? <h2>{initialValues ? t('orderForm.editTitle') : t('orderForm.title')}</h2> : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          {t('orderForm.client')}
          <select name="clientId" value={formState.clientId} onChange={handleChange} required>
            <option value="">{t('orderForm.clientPlaceholder')}</option>
            {clients.filter((client) => client.isActive).map((client) => (
              <option key={client.id} value={client.id}>{client.fullName}</option>
            ))}
          </select>
        </label>

        <label>
          {t('orderForm.titleLabel')}
          <input name="title" value={formState.title} onChange={handleChange} required />
        </label>

        <label>
          {t('orderForm.description')}
          <textarea name="description" value={formState.description} onChange={handleChange} rows="3" />
        </label>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <label>
            {t('orderForm.status')}
            <select name="status" value={formState.status} onChange={handleChange}>
              {['New', 'Confirmed', 'InProgress', 'Ready', 'Completed', 'Cancelled'].map((status) => (
                <option key={status} value={status}>{t(`orderStatus.${status}`)}</option>
              ))}
            </select>
          </label>
          <label>
            {t('orderForm.deliveryMethod')}
            <select name="deliveryMethod" value={formState.deliveryMethod} onChange={handleChange}>
              <option value="Pickup">{t('orderDeliveryMethod.Pickup')}</option>
              <option value="Shipping">{t('orderDeliveryMethod.Shipping')}</option>
            </select>
          </label>
          <label>
            {t('orderForm.dueDate')}
            <input name="dueDate" type="date" value={formState.dueDate} onChange={handleChange} />
          </label>
        </div>

        <OrderItemsEditor
          items={formState.items}
          onChange={(items) => setFormState((current) => ({ ...current, items }))}
          isSubmitting={isSubmitting}
        />

        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : initialValues ? t('orderForm.update') : t('orderForm.save')}
        </button>
      </form>
    </>
  );

  return variant === 'card' ? <article className="card">{content}</article> : <div>{content}</div>;
}

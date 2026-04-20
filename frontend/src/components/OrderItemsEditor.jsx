import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { formatCurrency } from '../utils/formatters';
import { t } from '../utils/i18n';

const createItem = () => ({
  name: '',
  notes: '',
  quantity: 1,
  unitPrice: 0
});

export default function OrderItemsEditor({ items, onChange, isSubmitting }) {
  const handleItemChange = (index, field, value) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => onChange([...(items ?? []), createItem()]);

  const removeItem = (index) => onChange(items.filter((_, itemIndex) => itemIndex !== index));

  const mappedItems = items ?? [];
  const totalAmount = mappedItems.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0) * Number(item.unitPrice ?? 0),
    0
  );

  return (
    <div className="stack">
      <div className="card-header" style={{ padding: 0 }}>
        <h3>{t('orderForm.itemsTitle')}</h3>
        <button type="button" className="secondary" onClick={addItem} disabled={isSubmitting}>
          <AddIcon fontSize="small" />
          {t('orderForm.addItem')}
        </button>
      </div>

      {mappedItems.length === 0 ? <p className="muted">{t('orderForm.noItems')}</p> : null}

      {mappedItems.map((item, index) => {
        const lineTotal = Number(item.quantity ?? 0) * Number(item.unitPrice ?? 0);

        return (
          <article key={`order-item-${index}`} className="card" style={{ margin: 0 }}>
            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr auto', alignItems: 'end' }}>
              <label>
                {t('orderForm.itemName')}
                <input
                  value={item.name}
                  onChange={(event) => handleItemChange(index, 'name', event.target.value)}
                  required
                />
              </label>
              <label>
                {t('orderForm.itemQuantity')}
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.quantity}
                  onChange={(event) => handleItemChange(index, 'quantity', event.target.value)}
                  required
                />
              </label>
              <label>
                {t('orderForm.itemUnitPrice')}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(event) => handleItemChange(index, 'unitPrice', event.target.value)}
                  required
                />
              </label>
              <button type="button" className="ghost danger" onClick={() => removeItem(index)}>
                <DeleteOutlineIcon fontSize="small" />
                {t('orderForm.removeItem')}
              </button>
            </div>
            <label>
              {t('orderForm.itemNotes')}
              <textarea
                rows="2"
                value={item.notes}
                onChange={(event) => handleItemChange(index, 'notes', event.target.value)}
              />
            </label>
            <p className="muted">{t('orderForm.itemSubtotal', { value: formatCurrency(lineTotal) })}</p>
          </article>
        );
      })}

      <p><strong>{t('orderForm.total', { value: formatCurrency(totalAmount) })}</strong></p>
    </div>
  );
}

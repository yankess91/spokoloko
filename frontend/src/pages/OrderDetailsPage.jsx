import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import useOrders from '../hooks/useOrders';
import { ordersApi } from '../api';
import { useToast } from '../components/ToastProvider';
import { formatCurrency, formatDate } from '../utils/formatters';
import { t } from '../utils/i18n';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { updateOrderStatus } = useOrders();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await ordersApi.getById(id);
        setOrder(data);
      } catch (err) {
        showToast(err.message ?? t('ordersPage.toastLoadError'), { severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, showToast]);

  if (isLoading) {
    return <p className="card muted">{t('ordersPage.loading')}</p>;
  }

  if (!order) {
    return <p className="card muted">{t('ordersPage.notFound')}</p>;
  }

  return (
    <div className="page-content">
      <header className="section-header detail-header modern-surface">
        <h1>{order.number}</h1>
        <p className="muted">{order.title}</p>
        <div className="section-actions detail-actions">
          <Link className="ghost" to="/orders">
            <ArrowBackRoundedIcon fontSize="small" />
            {t('ordersPage.backToList')}
          </Link>
        </div>
      </header>

      <section className="grid detail-grid">
        <article className="card detail-card">
          <h2>{t('ordersPage.detailsInfo')}</h2>
          <p>{t('ordersPage.columns.client')}: {order.clientName}</p>
          <p>{t('ordersPage.columns.status')}: {t(`orderStatus.${order.status}`)}</p>
          <p>{t('ordersPage.columns.delivery')}: {t(`orderDeliveryMethod.${order.deliveryMethod}`)}</p>
          <p>{t('ordersPage.columns.dueDate')}: {order.dueDate ? formatDate(order.dueDate) : t('formatters.noData')}</p>
          <p>{t('ordersPage.columns.createdAt')}: {formatDate(order.createdAt)}</p>
          <p>{t('ordersPage.updatedAt')}: {formatDate(order.updatedAt)}</p>
          <p>{t('ordersPage.descriptionLabel')}: {order.description || t('formatters.noData')}</p>
        </article>

        <article className="card detail-card">
          <h2>{t('ordersPage.itemsTitle')}</h2>
          {order.items?.length ? (
            <ul className="list stacked detail-stack-list">
              {order.items.map((item) => (
                <li key={item.id}>
                  <span className="list-title">{item.name}</span>
                  <span className="muted">{item.quantity} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.lineTotal)}</span>
                  <span className="muted">{item.notes || t('formatters.noData')}</span>
                </li>
              ))}
            </ul>
          ) : <p className="muted">{t('orderForm.noItems')}</p>}
          <p><strong>{t('ordersPage.columns.total')}: {formatCurrency(order.totalAmount)}</strong></p>
          <label>
            {t('ordersPage.columns.status')}
            <select
              value={order.status}
              onChange={async (event) => {
                const updated = await updateOrderStatus(order.id, event.target.value);
                setOrder(updated);
              }}
            >
              {['New', 'Confirmed', 'InProgress', 'Ready', 'Completed', 'Cancelled'].map((status) => (
                <option key={status} value={status}>{t(`orderStatus.${status}`)}</option>
              ))}
            </select>
          </label>
        </article>
      </section>
    </div>
  );
}

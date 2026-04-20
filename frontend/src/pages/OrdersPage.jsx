import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import Modal from '../components/Modal';
import OrderForm from '../components/OrderForm';
import useOrders from '../hooks/useOrders';
import { useToast } from '../components/ToastProvider';
import { formatCurrency, formatDate } from '../utils/formatters';
import { t } from '../utils/i18n';

export default function OrdersPage() {
  const { orders, isLoading, error, addOrder, updateOrder, updateOrderStatus, removeOrder, updateFilters } = useOrders();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('');

  useEffect(() => {
    updateFilters({ search, status: statusFilter || undefined, deliveryMethod: deliveryFilter || undefined });
  }, [search, statusFilter, deliveryFilter, updateFilters]);

  useEffect(() => {
    if (error) {
      showToast(error, { severity: 'error' });
    }
  }, [error, showToast]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, payload);
        showToast(t('ordersPage.toastUpdated'));
      } else {
        await addOrder(payload);
        showToast(t('ordersPage.toastSaved'));
      }
      closeModal();
    } catch (err) {
      showToast(err.message ?? t('ordersPage.toastSaveError'), { severity: 'error' });
      return false;
    } finally {
      setIsSubmitting(false);
    }

    return true;
  };

  const handleDelete = async (order) => {
    if (!window.confirm(t('ordersPage.deleteConfirm', { name: order.title }))) {
      return;
    }

    try {
      await removeOrder(order.id);
      showToast(t('ordersPage.toastDeleted'));
    } catch (err) {
      showToast(err.message ?? t('ordersPage.toastDeleteError'), { severity: 'error' });
    }
  };

  const handleStatusChange = async (order, status) => {
    try {
      await updateOrderStatus(order.id, status);
      showToast(t('ordersPage.toastStatusUpdated'));
    } catch (err) {
      showToast(err.message ?? t('ordersPage.toastSaveError'), { severity: 'error' });
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{t('ordersPage.title')}</h1>
        <p className="muted">{t('ordersPage.subtitle')}</p>
      </header>

      <article className="card">
        <header className="card-header">
          <div>
            <h2>{t('ordersPage.listTitle')}</h2>
            <p className="muted">{t('ordersPage.listSubtitle')}</p>
          </div>
        </header>

        <div className="grid-actions">
          <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
            <AddIcon fontSize="small" />
            {t('ordersPage.newOrder')}
          </button>
        </div>

        <div className="list-controls grid-controls">
          <label className="filter-field">
            {t('ordersPage.searchLabel')}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('ordersPage.searchPlaceholder')}
            />
          </label>
          <label className="filter-field">
            {t('ordersPage.statusLabel')}
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">{t('ordersPage.statusAll')}</option>
              {['New', 'Confirmed', 'InProgress', 'Ready', 'Completed', 'Cancelled'].map((status) => (
                <option key={status} value={status}>{t(`orderStatus.${status}`)}</option>
              ))}
            </select>
          </label>
          <label className="filter-field">
            {t('ordersPage.deliveryLabel')}
            <select value={deliveryFilter} onChange={(event) => setDeliveryFilter(event.target.value)}>
              <option value="">{t('ordersPage.deliveryAll')}</option>
              <option value="Pickup">{t('orderDeliveryMethod.Pickup')}</option>
              <option value="Shipping">{t('orderDeliveryMethod.Shipping')}</option>
            </select>
          </label>
        </div>

        {isLoading ? <p className="muted">{t('ordersPage.loading')}</p> : null}
        {!isLoading && orders.length === 0 ? <p className="muted">{t('ordersPage.empty')}</p> : null}

        {!isLoading && orders.length > 0 ? (
          <div className="data-grid" role="table" aria-label={t('ordersPage.ariaLabel')}>
            <div className="data-grid-row data-grid-header" role="row">
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.number')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.client')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.title')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.status')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.delivery')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.dueDate')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.total')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.createdAt')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.actions')}</span>
            </div>
            {orders.map((order) => (
              <div key={order.id} className="data-grid-row" role="row">
                <div className="data-grid-cell">{order.number}</div>
                <div className="data-grid-cell">{order.clientName}</div>
                <div className="data-grid-cell">{order.title}</div>
                <div className="data-grid-cell">
                  <select value={order.status} onChange={(event) => handleStatusChange(order, event.target.value)}>
                    {['New', 'Confirmed', 'InProgress', 'Ready', 'Completed', 'Cancelled'].map((status) => (
                      <option key={status} value={status}>{t(`orderStatus.${status}`)}</option>
                    ))}
                  </select>
                </div>
                <div className="data-grid-cell">{t(`orderDeliveryMethod.${order.deliveryMethod}`)}</div>
                <div className="data-grid-cell">{order.dueDate ? formatDate(order.dueDate) : t('formatters.noData')}</div>
                <div className="data-grid-cell">{formatCurrency(order.totalAmount)}</div>
                <div className="data-grid-cell">{formatDate(order.createdAt)}</div>
                <div className="data-grid-cell data-grid-actions">
                  <Link className="ghost" to={`/orders/${order.id}`}>
                    <VisibilityRoundedIcon fontSize="small" />
                    {t('ordersPage.details')}
                  </Link>
                  <button type="button" className="ghost" onClick={() => { setEditingOrder(order); setIsModalOpen(true); }}>
                    <EditOutlinedIcon fontSize="small" />
                    {t('serviceList.edit')}
                  </button>
                  <button type="button" className="ghost danger" onClick={() => handleDelete(order)}>
                    <DeleteOutlineIcon fontSize="small" />
                    {t('serviceList.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </article>

      {isModalOpen ? (
        <Modal title={editingOrder ? t('ordersPage.editModalTitle') : t('ordersPage.modalTitle')} onClose={closeModal}>
          <OrderForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialValues={editingOrder}
            showTitle={false}
            variant="plain"
          />
        </Modal>
      ) : null}
    </div>
  );
}

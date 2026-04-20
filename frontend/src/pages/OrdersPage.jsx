import { useCallback, useEffect, useMemo, useState } from 'react';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Modal from '../components/Modal';
import ServiceForm from '../components/ServiceForm';
import useServices from '../hooks/useServices';
import { useToast } from '../components/ToastProvider';
import { formatCurrencyRange } from '../utils/formatters';
import { t } from '../utils/i18n';

const toServicePayload = (service, overrides = {}) => ({
  name: service.name,
  description: service.description ?? '',
  durationFromMinutes: Number(service.durationFromMinutes ?? 0),
  durationToMinutes: Number(service.durationToMinutes ?? 0),
  priceFrom: Number(service.priceFrom ?? 0),
  priceTo: Number(service.priceTo ?? 0),
  type: service.type ?? 'OnSite',
  maxCompletionTimeDays: service.maxCompletionTimeDays ?? null,
  orderPosition: service.orderPosition ?? 0,
  requiredProductIds: (service.requiredProducts ?? []).map((product) => product.id),
  ...overrides
});

export default function OrdersPage() {
  const { services, isLoading, error, addService, updateService, removeService } = useServices();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const customOrders = useMemo(
    () => [...services]
      .filter((service) => service.type === 'CustomOrder')
      .sort((a, b) => Number(a.orderPosition ?? 0) - Number(b.orderPosition ?? 0)),
    [services]
  );

  const showError = useCallback(
    (message) => showToast(message, { severity: 'error' }),
    [showToast]
  );

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingOrder) {
        await updateService(editingOrder.id, {
          ...payload,
          orderPosition: editingOrder.orderPosition
        });
        showToast(t('ordersPage.toastUpdated'));
      } else {
        const lastOrderPosition = customOrders.length
          ? Math.max(...customOrders.map((item) => Number(item.orderPosition ?? 0)))
          : 0;

        await addService({
          ...payload,
          type: 'CustomOrder',
          orderPosition: lastOrderPosition + 1
        });
        showToast(t('ordersPage.toastSaved'));
      }

      closeModal();
    } catch (err) {
      showError(err.message ?? t('ordersPage.toastSaveError'));
      return false;
    } finally {
      setIsSubmitting(false);
    }

    return true;
  };

  const handleDelete = async (order) => {
    if (!window.confirm(t('ordersPage.deleteConfirm', { name: order.name }))) {
      return;
    }

    try {
      await removeService(order.id);
      showToast(t('ordersPage.toastDeleted'));
    } catch (err) {
      showError(err.message ?? t('ordersPage.toastDeleteError'));
    }
  };

  const handleSwapOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= customOrders.length) {
      return;
    }

    const current = customOrders[index];
    const target = customOrders[targetIndex];

    setIsSubmitting(true);
    try {
      await Promise.all([
        updateService(current.id, toServicePayload(current, { orderPosition: target.orderPosition })),
        updateService(target.id, toServicePayload(target, { orderPosition: current.orderPosition }))
      ]);
      showToast(t('ordersPage.toastReordered'));
    } catch (err) {
      showError(err.message ?? t('ordersPage.toastReorderError'));
    } finally {
      setIsSubmitting(false);
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
          <button
            type="button"
            className="primary"
            onClick={() => {
              setEditingOrder(null);
              setIsModalOpen(true);
            }}
          >
            <AddIcon fontSize="small" />
            {t('ordersPage.newOrder')}
          </button>
        </div>

        {isLoading ? <p className="muted">{t('serviceList.loading')}</p> : null}

        {!isLoading && customOrders.length === 0 ? (
          <p className="muted">{t('ordersPage.empty')}</p>
        ) : null}

        {!isLoading && customOrders.length > 0 ? (
          <div className="data-grid data-grid-services" role="table" aria-label={t('ordersPage.ariaLabel')}>
            <div className="data-grid-row data-grid-header" role="row">
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.position')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.order')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.maxCompletionTime')}</span>
              <span className="data-grid-cell" role="columnheader">{t('ordersPage.columns.actions')}</span>
            </div>
            {customOrders.map((order, index) => (
              <div key={order.id} className="data-grid-row" role="row">
                <div className="data-grid-cell" role="cell">#{index + 1}</div>
                <div className="data-grid-cell" role="cell">
                  <div className="data-grid-title">{order.name}</div>
                  <div className="data-grid-meta">{order.description || t('serviceList.noDescription')}</div>
                  <div className="data-grid-meta">{order.duration}</div>
                  <div className="data-grid-meta">{formatCurrencyRange(order.priceFrom, order.priceTo)}</div>
                </div>
                <div className="data-grid-cell" role="cell">
                  {t('ordersPage.maxCompletionTimeValue', { days: order.maxCompletionTimeDays ?? 0 })}
                </div>
                <div className="data-grid-cell data-grid-actions" role="cell">
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => handleSwapOrder(index, -1)}
                    disabled={index === 0 || isSubmitting}
                  >
                    <ArrowUpwardRoundedIcon fontSize="small" />
                    {t('ordersPage.moveUp')}
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => handleSwapOrder(index, 1)}
                    disabled={index === customOrders.length - 1 || isSubmitting}
                  >
                    <ArrowDownwardRoundedIcon fontSize="small" />
                    {t('ordersPage.moveDown')}
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => {
                      setEditingOrder(order);
                      setIsModalOpen(true);
                    }}
                  >
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
        <Modal
          title={editingOrder ? t('ordersPage.editModalTitle') : t('ordersPage.modalTitle')}
          onClose={closeModal}
        >
          <ServiceForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialValues={editingOrder}
            showTitle={false}
            variant="plain"
            forcedType="CustomOrder"
          />
        </Modal>
      ) : null}
    </div>
  );
}

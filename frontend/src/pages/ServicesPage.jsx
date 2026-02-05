import { useCallback, useEffect, useMemo, useState } from 'react';
import ServiceForm from '../components/ServiceForm';
import ServiceList from '../components/ServiceList';
import Modal from '../components/Modal';
import useServices from '../hooks/useServices';
import { useToast } from '../components/ToastProvider';
import AddIcon from '@mui/icons-material/Add';
import { t } from '../utils/i18n';

export default function ServicesPage() {
  const { services, isLoading, error, addService, removeService } = useServices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);

  const sortedServices = useMemo(
    () => [...services].sort((a, b) => a.name.localeCompare(b.name)),
    [services]
  );
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(sortedServices.length / pageSize));
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedServices.slice(start, start + pageSize);
  }, [currentPage, sortedServices]);

  const showError = useCallback(
    (message) => showToast(message, { severity: 'error' }),
    [showToast]
  );

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortedServices.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await addService(payload);
      showToast(t('servicesPage.toastSaved'));
      setIsModalOpen(false);
    } catch (err) {
      showError(err.message ?? t('servicesPage.toastSaveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (service) => {
    if (!window.confirm(t('servicesPage.deleteConfirm', { name: service.name }))) {
      return;
    }
    try {
      await removeService(service.id);
      showToast(t('servicesPage.toastDeleted'));
    } catch (err) {
      showError(err.message ?? t('servicesPage.toastDeleteError'));
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{t('servicesPage.title')}</h1>
        <p className="muted">{t('servicesPage.subtitle')}</p>
      </header>

      <section className="stack">
        <article className="card">
          <header className="card-header">
            <div>
              <h2>{t('servicesPage.listTitle')}</h2>
              <p className="muted">{t('servicesPage.listSubtitle')}</p>
            </div>
          </header>
          <div className="grid-actions">
            <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
              <AddIcon fontSize="small" />
              {t('servicesPage.newService')}
            </button>
          </div>
          <ServiceList
            services={paginatedServices}
            isLoading={isLoading}
            linkBase="/services"
            onDelete={handleDelete}
          />
          {!isLoading && sortedServices.length > 0 ? (
            <div className="pagination-controls" aria-label={t('pagination.ariaLabel')}>
              <button
                type="button"
                className="ghost"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                {t('pagination.previous')}
              </button>
              <span className="pagination-status">
                {t('pagination.status', { current: currentPage, total: totalPages })}
              </span>
              <button
                type="button"
                className="ghost"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                {t('pagination.next')}
              </button>
            </div>
          ) : null}
        </article>
      </section>

      {isModalOpen ? (
        <Modal title={t('servicesPage.modalTitle')} onClose={() => setIsModalOpen(false)}>
          <ServiceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} showTitle={false} variant="plain" />
        </Modal>
      ) : null}
    </div>
  );
}

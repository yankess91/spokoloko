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

  const sortedServices = useMemo(
    () => [...services].sort((a, b) => a.name.localeCompare(b.name)),
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
            services={sortedServices}
            isLoading={isLoading}
            linkBase="/services"
            onDelete={handleDelete}
          />
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

import { useCallback, useEffect, useMemo, useState } from 'react';
import ClientForm from '../components/ClientForm';
import ClientGrid from '../components/ClientGrid';
import Modal from '../components/Modal';
import useClients from '../hooks/useClients';
import { useToast } from '../components/ToastProvider';
import AddIcon from '@mui/icons-material/Add';
import { t } from '../utils/i18n';

export default function ClientsPage() {
  const { clients, isLoading, error, addClient, updateStatus, removeClient } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingClientId, setUpdatingClientId] = useState(null);
  const { showToast } = useToast();

  const sortedClients = useMemo(
    () => [...clients].sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [clients]
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
      await addClient(payload);
      showToast(t('clientsPage.toastSaved'));
      setIsModalOpen(false);
    } catch (err) {
      showError(err.message ?? t('clientsPage.toastSaveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (client) => {
    setUpdatingClientId(client.id);
    try {
      await updateStatus(client.id, !client.isActive);
      showToast(
        client.isActive ? t('clientsPage.toastDeactivated') : t('clientsPage.toastActivated')
      );
    } catch (err) {
      showError(err.message ?? t('clientsPage.toastStatusError'));
    } finally {
      setUpdatingClientId(null);
    }
  };

  const handleDelete = (client) => {
    if (!window.confirm(t('clientsPage.deleteConfirm', { name: client.fullName }))) {
      return;
    }
    removeClient(client.id);
    showToast(t('clientsPage.toastDeleted'));
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{t('clientsPage.title')}</h1>
        <p className="muted">{t('clientsPage.subtitle')}</p>
      </header>

      <section className="stack">
        <article className="card">
          <header className="card-header">
            <div>
              <h2>{t('clientsPage.listTitle')}</h2>
              <p className="muted">{t('clientsPage.listSubtitle')}</p>
            </div>
          </header>
          <div className="grid-actions">
            <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
              <AddIcon fontSize="small" />
              {t('clientsPage.newClient')}
            </button>
          </div>
          <ClientGrid
            clients={sortedClients}
            isLoading={isLoading}
            linkBase="/clients"
            onToggleStatus={handleStatusToggle}
            updatingClientId={updatingClientId}
            onDelete={handleDelete}
          />
        </article>
      </section>

      {isModalOpen ? (
        <Modal title={t('clientsPage.modalTitle')} onClose={() => setIsModalOpen(false)}>
          <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} showTitle={false} variant="plain" />
        </Modal>
      ) : null}
    </div>
  );
}

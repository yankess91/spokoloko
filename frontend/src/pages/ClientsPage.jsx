import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import ClientForm from '../components/ClientForm';
import ClientGrid from '../components/ClientGrid';
import Modal from '../components/Modal';
import useClients from '../hooks/useClients';
import { useToast } from '../components/ToastProvider';
import AddIcon from '@mui/icons-material/Add';
import { t } from '../utils/i18n';
import { createCollator, includesNormalizedValue, normalizeSearchTerm } from '../utils/collectionOptimizers';

const collator = createCollator();

export default function ClientsPage() {
  const { clients, isLoading, error, addClient, updateClient, updateStatus, removeClient } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [updatingClientId, setUpdatingClientId] = useState(null);
  const { showToast } = useToast();

  const sortedClients = useMemo(() => {
    const items = [...clients];
    items.sort((a, b) => collator.compare(a.fullName ?? '', b.fullName ?? ''));
    return items;
  }, [clients]);

  const filteredClients = useMemo(() => {
    const normalizedSearch = normalizeSearchTerm(deferredSearchTerm);

    return sortedClients.filter((client) => {
      const matchesStatus =
        statusFilter === 'all' || (statusFilter === 'active' ? client.isActive : !client.isActive);
      const matchesSearch = includesNormalizedValue(
        [client.fullName, client.email, client.phoneNumber],
        normalizedSearch
      );

      return matchesStatus && matchesSearch;
    });
  }, [sortedClients, statusFilter, deferredSearchTerm]);

  const showError = useCallback((message) => showToast(message, { severity: 'error' }), [showToast]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingClient) {
        await updateClient(editingClient.id, payload);
        showToast(t('clientsPage.toastUpdated'));
      } else {
        await addClient(payload);
        showToast(t('clientsPage.toastSaved'));
      }
      closeModal();
    } catch (err) {
      showError(err.message ?? t('clientsPage.toastSaveError'));
      return false;
    } finally {
      setIsSubmitting(false);
    }

    return true;
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (client) => {
    setUpdatingClientId(client.id);
    try {
      await updateStatus(client.id, !client.isActive);
      showToast(client.isActive ? t('clientsPage.toastDeactivated') : t('clientsPage.toastActivated'));
    } catch (err) {
      showError(err.message ?? t('clientsPage.toastStatusError'));
    } finally {
      setUpdatingClientId(null);
    }
  };

  const handleDelete = async (client) => {
    if (!window.confirm(t('clientsPage.deleteConfirm', { name: client.fullName }))) {
      return;
    }

    setUpdatingClientId(client.id);
    try {
      await removeClient(client.id);
      showToast(t('clientsPage.toastDeleted'));
    } catch (err) {
      showError(err.message ?? t('clientsPage.toastStatusError'));
    } finally {
      setUpdatingClientId(null);
    }
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
            <button
              type="button"
              className="primary"
              onClick={() => {
                setEditingClient(null);
                setIsModalOpen(true);
              }}
            >
              <AddIcon fontSize="small" />
              {t('clientsPage.newClient')}
            </button>
          </div>
          <div className="list-controls grid-controls">
            <label className="filter-field">
              {t('clientsPage.filterLabel')}
              <input
                type="search"
                placeholder={t('clientsPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
            <label className="filter-field">
              {t('clientsPage.statusLabel')}
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">{t('clientsPage.statusAll')}</option>
                <option value="active">{t('clientsPage.statusActive')}</option>
                <option value="inactive">{t('clientsPage.statusInactive')}</option>
              </select>
            </label>
          </div>
          <ClientGrid
            clients={filteredClients}
            isLoading={isLoading}
            linkBase="/clients"
            onEdit={handleEdit}
            onToggleStatus={handleStatusToggle}
            updatingClientId={updatingClientId}
          />
        </article>
      </section>

      {isModalOpen ? (
        <Modal
          title={editingClient ? t('clientsPage.editModalTitle') : t('clientsPage.modalTitle')}
          onClose={closeModal}
        >
          <ClientForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialValues={editingClient}
            showTitle={false}
            variant="plain"
          />
        </Modal>
      ) : null}
    </div>
  );
}

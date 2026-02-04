import { useCallback, useEffect, useMemo, useState } from 'react';
import ClientForm from '../components/ClientForm';
import ClientGrid from '../components/ClientGrid';
import Modal from '../components/Modal';
import useClients from '../hooks/useClients';
import { useToast } from '../components/ToastProvider';

export default function ClientsPage() {
  const { clients, isLoading, error, addClient, updateStatus } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingClientId, setUpdatingClientId] = useState(null);
  const { showToast } = useToast();

  const sortedClients = useMemo(
    () => [...clients].sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [clients]
  );

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (statusFilter === 'active') {
      return sortedClients.filter(
        (client) =>
          client.isActive &&
          (!normalizedSearch ||
            [client.fullName, client.email, client.phoneNumber]
              .filter(Boolean)
              .some((value) => value.toLowerCase().includes(normalizedSearch)))
      );
    }
    if (statusFilter === 'inactive') {
      return sortedClients.filter(
        (client) =>
          !client.isActive &&
          (!normalizedSearch ||
            [client.fullName, client.email, client.phoneNumber]
              .filter(Boolean)
              .some((value) => value.toLowerCase().includes(normalizedSearch)))
      );
    }
    if (!normalizedSearch) {
      return sortedClients;
    }
    return sortedClients.filter((client) =>
      [client.fullName, client.email, client.phoneNumber]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch))
    );
  }, [sortedClients, statusFilter, searchTerm]);

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
      showToast('Profil klientki został zapisany.');
      setIsModalOpen(false);
    } catch (err) {
      showError(err.message ?? 'Nie udało się zapisać profilu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (client) => {
    setUpdatingClientId(client.id);
    try {
      await updateStatus(client.id, !client.isActive);
      showToast(
        client.isActive ? 'Klientka została dezaktywowana.' : 'Klientka została aktywowana.'
      );
    } catch (err) {
      showError(err.message ?? 'Nie udało się zmienić statusu.');
    } finally {
      setUpdatingClientId(null);
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>Użytkowniczki</h1>
        <p className="muted">
          Dodawaj nowe profile klientek i sprawdzaj historię ich produktów.
        </p>
      </header>

      <section className="stack">
        <article className="card">
          <header className="card-header">
            <div>
              <h2>Lista klientek</h2>
              <p className="muted">Przeglądaj dane oraz zarządzaj statusem profilu.</p>
            </div>
            <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
              Nowa klientka
            </button>
          </header>
          <div className="list-controls grid-controls">
            <label className="filter-field">
              Filtruj
              <input
                type="search"
                placeholder="Wpisz imię, email lub telefon"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
            <label className="filter-field">
              Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">Wszystkie klientki</option>
                <option value="active">Aktywne klientki</option>
                <option value="inactive">Nieaktywne klientki</option>
              </select>
            </label>
          </div>
          <ClientGrid
            clients={filteredClients}
            isLoading={isLoading}
            linkBase="/clients"
            onToggleStatus={handleStatusToggle}
            updatingClientId={updatingClientId}
          />
        </article>
      </section>

      {isModalOpen ? (
        <Modal title="Nowa klientka" onClose={() => setIsModalOpen(false)}>
          <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} showTitle={false} variant="plain" />
        </Modal>
      ) : null}
    </div>
  );
}

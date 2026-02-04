import { useCallback, useEffect, useMemo, useState } from 'react';
import ClientForm from '../components/ClientForm';
import ClientList from '../components/ClientList';
import useClients from '../hooks/useClients';
import { useToast } from '../components/ToastProvider';

export default function ClientsPage() {
  const { clients, isLoading, error, addClient } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();

  const sortedClients = useMemo(
    () => [...clients].sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [clients]
  );

  const filteredClients = useMemo(() => {
    if (statusFilter === 'active') {
      return sortedClients.filter((client) => client.isActive);
    }
    if (statusFilter === 'inactive') {
      return sortedClients.filter((client) => !client.isActive);
    }
    return sortedClients;
  }, [sortedClients, statusFilter]);

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
    } catch (err) {
      showError(err.message ?? 'Nie udało się zapisać profilu.');
    } finally {
      setIsSubmitting(false);
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

      <section className="grid">
        <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        <div className="stack">
          <div className="list-controls">
            <label className="filter-field">
              Filtr statusu
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">Wszystkie klientki</option>
                <option value="active">Aktywne klientki</option>
                <option value="inactive">Nieaktywne klientki</option>
              </select>
            </label>
          </div>
          <ClientList clients={filteredClients} isLoading={isLoading} linkBase="/clients" />
        </div>
      </section>
    </div>
  );
}

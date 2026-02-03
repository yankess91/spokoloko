import { useCallback, useEffect, useMemo, useState } from 'react';
import ClientForm from '../components/ClientForm';
import ClientList from '../components/ClientList';
import useClients from '../hooks/useClients';
import { useToast } from '../components/ToastProvider';

export default function ClientsPage() {
  const { clients, isLoading, error, addClient } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          <ClientList clients={sortedClients} isLoading={isLoading} linkBase="/clients" />
        </div>
      </section>
    </div>
  );
}

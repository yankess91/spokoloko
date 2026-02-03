import { useMemo, useState } from 'react';
import ClientForm from '../components/ClientForm';
import ClientList from '../components/ClientList';
import useClients from '../hooks/useClients';

export default function ClientsPage() {
  const { clients, isLoading, error, addClient } = useClients();
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const sortedClients = useMemo(
    () => [...clients].sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [clients]
  );

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');
    try {
      await addClient(payload);
      setSuccessMessage('Profil klientki został zapisany.');
    } catch (err) {
      setFormError(err.message ?? 'Nie udało się zapisać profilu.');
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
          {formError ? <p className="card error">{formError}</p> : null}
          {successMessage ? <p className="card success">{successMessage}</p> : null}
          {error ? <p className="card error">{error}</p> : null}
          <ClientList clients={sortedClients} isLoading={isLoading} linkBase="/clients" />
        </div>
      </section>
    </div>
  );
}

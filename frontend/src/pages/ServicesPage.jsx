import { useCallback, useEffect, useMemo, useState } from 'react';
import ServiceForm from '../components/ServiceForm';
import ServiceList from '../components/ServiceList';
import Modal from '../components/Modal';
import useServices from '../hooks/useServices';
import { useToast } from '../components/ToastProvider';

export default function ServicesPage() {
  const { services, isLoading, error, addService } = useServices();
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
      showToast('Usługa została zapisana.');
      setIsModalOpen(false);
    } catch (err) {
      showError(err.message ?? 'Nie udało się zapisać usługi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>Usługi</h1>
        <p className="muted">Lista usług oferowanych w salonie.</p>
      </header>

      <section className="stack">
        <article className="card">
          <header className="card-header">
            <div>
              <h2>Lista usług</h2>
              <p className="muted">Zarządzaj ofertą i aktualizuj szczegóły zabiegów.</p>
            </div>
          </header>
          <div className="grid-actions">
            <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
              Nowa usługa
            </button>
          </div>
          <ServiceList services={sortedServices} isLoading={isLoading} linkBase="/services" />
        </article>
      </section>

      {isModalOpen ? (
        <Modal title="Nowa usługa" onClose={() => setIsModalOpen(false)}>
          <ServiceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} showTitle={false} variant="plain" />
        </Modal>
      ) : null}
    </div>
  );
}

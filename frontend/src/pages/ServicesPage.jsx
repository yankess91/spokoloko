import { useCallback, useEffect, useMemo, useState } from 'react';
import ServiceForm from '../components/ServiceForm';
import ServiceList from '../components/ServiceList';
import useServices from '../hooks/useServices';
import { useToast } from '../components/ToastProvider';

export default function ServicesPage() {
  const { services, isLoading, error, addService } = useServices();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      <section className="grid">
        <ServiceForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
        <div className="stack">
          <ServiceList services={sortedServices} isLoading={isLoading} linkBase="/services" />
        </div>
      </section>
    </div>
  );
}

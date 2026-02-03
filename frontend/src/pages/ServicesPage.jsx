import { useMemo, useState } from 'react';
import ServiceForm from '../components/ServiceForm';
import ServiceList from '../components/ServiceList';
import useServices from '../hooks/useServices';

export default function ServicesPage() {
  const { services, isLoading, error, addService } = useServices();
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedServices = useMemo(
    () => [...services].sort((a, b) => a.name.localeCompare(b.name)),
    [services]
  );

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');
    try {
      await addService(payload);
      setSuccessMessage('Usługa została zapisana.');
    } catch (err) {
      setFormError(err.message ?? 'Nie udało się zapisać usługi.');
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
          {formError ? <p className="card error">{formError}</p> : null}
          {successMessage ? <p className="card success">{successMessage}</p> : null}
          {error ? <p className="card error">{error}</p> : null}
          <ServiceList services={sortedServices} isLoading={isLoading} linkBase="/services" />
        </div>
      </section>
    </div>
  );
}

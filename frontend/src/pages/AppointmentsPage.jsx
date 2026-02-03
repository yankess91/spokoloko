import { useMemo, useState } from 'react';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import useAppointments from '../hooks/useAppointments';
import useClients from '../hooks/useClients';
import useProducts from '../hooks/useProducts';
import useServices from '../hooks/useServices';

export default function AppointmentsPage() {
  const { appointments, isLoading, error, addAppointment } = useAppointments();
  const { clients, isLoading: clientsLoading } = useClients();
  const { services, isLoading: servicesLoading } = useServices();
  const { products, isLoading: productsLoading } = useProducts();
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clientsById = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients]
  );

  const servicesById = useMemo(
    () => new Map(services.map((service) => [service.id, service])),
    [services]
  );

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');
    try {
      await addAppointment(payload);
      setSuccessMessage('Wizyta została zapisana.');
    } catch (err) {
      setFormError(err.message ?? 'Nie udało się zapisać wizyty.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>Wizyty</h1>
        <p className="muted">Planowanie i podgląd zaplanowanych spotkań.</p>
      </header>

      <section className="grid">
        <AppointmentForm
          clients={clients}
          services={services}
          products={products}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || clientsLoading || servicesLoading || productsLoading}
        />
        <div className="stack">
          {formError ? <p className="card error">{formError}</p> : null}
          {successMessage ? <p className="card success">{successMessage}</p> : null}
          {error ? <p className="card error">{error}</p> : null}
          <AppointmentList
            appointments={appointments}
            clientsById={clientsById}
            servicesById={servicesById}
            isLoading={isLoading}
          />
        </div>
      </section>
    </div>
  );
}

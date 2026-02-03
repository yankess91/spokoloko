import { useCallback, useEffect, useMemo, useState } from 'react';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import useAppointments from '../hooks/useAppointments';
import useClients from '../hooks/useClients';
import useServices from '../hooks/useServices';
import { useToast } from '../components/ToastProvider';

export default function AppointmentsPage() {
  const { appointments, isLoading, error, addAppointment } = useAppointments();
  const { clients, isLoading: clientsLoading } = useClients();
  const { services, isLoading: servicesLoading } = useServices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const clientsById = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients]
  );

  const servicesById = useMemo(
    () => new Map(services.map((service) => [service.id, service])),
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
      await addAppointment(payload);
      showToast('Wizyta została zapisana.');
    } catch (err) {
      showError(err.message ?? 'Nie udało się zapisać wizyty.');
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
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || clientsLoading || servicesLoading}
        />
        <div className="stack">
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

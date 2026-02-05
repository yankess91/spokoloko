import { useCallback, useEffect, useMemo, useState } from 'react';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import Modal from '../components/Modal';
import useAppointments from '../hooks/useAppointments';
import useClients from '../hooks/useClients';
import useServices from '../hooks/useServices';
import { useToast } from '../components/ToastProvider';
import AddIcon from '@mui/icons-material/Add';
import { t } from '../utils/i18n';

export default function AppointmentsPage() {
  const { appointments, isLoading, error, addAppointment, removeAppointment } = useAppointments();
  const { clients, isLoading: clientsLoading } = useClients();
  const { services, isLoading: servicesLoading } = useServices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      showToast(t('appointmentsPage.toastSaved'));
      setIsModalOpen(false);
    } catch (err) {
      showError(err.message ?? t('appointmentsPage.toastSaveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (appointment) => {
    if (!window.confirm(t('appointmentsPage.deleteConfirm'))) {
      return;
    }
    removeAppointment(appointment.id);
    showToast(t('appointmentsPage.toastDeleted'));
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{t('appointmentsPage.title')}</h1>
        <p className="muted">{t('appointmentsPage.subtitle')}</p>
      </header>

      <section className="stack">
        <article className="card">
          <header className="card-header">
            <div>
              <h2>{t('appointmentsPage.listTitle')}</h2>
              <p className="muted">{t('appointmentsPage.listSubtitle')}</p>
            </div>
          </header>
          <div className="grid-actions">
            <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
              <AddIcon fontSize="small" />
              {t('appointmentsPage.newAppointment')}
            </button>
          </div>
          <AppointmentList
            appointments={appointments}
            clientsById={clientsById}
            servicesById={servicesById}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        </article>
      </section>

      {isModalOpen ? (
        <Modal title={t('appointmentsPage.modalTitle')} onClose={() => setIsModalOpen(false)}>
          <AppointmentForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting || clientsLoading || servicesLoading}
            showTitle={false}
            variant="plain"
          />
        </Modal>
      ) : null}
    </div>
  );
}

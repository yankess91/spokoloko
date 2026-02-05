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
  const [sortBy, setSortBy] = useState('date-desc');
  const { showToast } = useToast();

  const clientsById = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients]
  );

  const servicesById = useMemo(
    () => new Map(services.map((service) => [service.id, service])),
    [services]
  );

  const sortedAppointments = useMemo(() => {
    const collator = new Intl.Collator('pl', { sensitivity: 'base' });

    return [...appointments].sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
        case 'service-asc': {
          const aName = servicesById.get(a.serviceId)?.name ?? '';
          const bName = servicesById.get(b.serviceId)?.name ?? '';
          return collator.compare(aName, bName);
        }
        case 'service-desc': {
          const aName = servicesById.get(a.serviceId)?.name ?? '';
          const bName = servicesById.get(b.serviceId)?.name ?? '';
          return collator.compare(bName, aName);
        }
        case 'client-asc': {
          const aName = clientsById.get(a.clientId)?.fullName ?? '';
          const bName = clientsById.get(b.clientId)?.fullName ?? '';
          return collator.compare(aName, bName);
        }
        case 'client-desc': {
          const aName = clientsById.get(a.clientId)?.fullName ?? '';
          const bName = clientsById.get(b.clientId)?.fullName ?? '';
          return collator.compare(bName, aName);
        }
        case 'date-desc':
        default:
          return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
      }
    });
  }, [appointments, sortBy, clientsById, servicesById]);

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
          <div className="list-controls grid-controls">
            <label className="filter-field">
              {t('appointmentsPage.sortLabel')}
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="date-desc">{t('appointmentsPage.sortDateDesc')}</option>
                <option value="date-asc">{t('appointmentsPage.sortDateAsc')}</option>
                <option value="service-asc">{t('appointmentsPage.sortServiceAsc')}</option>
                <option value="service-desc">{t('appointmentsPage.sortServiceDesc')}</option>
                <option value="client-asc">{t('appointmentsPage.sortClientAsc')}</option>
                <option value="client-desc">{t('appointmentsPage.sortClientDesc')}</option>
              </select>
            </label>
          </div>
          <AppointmentList
            appointments={sortedAppointments}
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

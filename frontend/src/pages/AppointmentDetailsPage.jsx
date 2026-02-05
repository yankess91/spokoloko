import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAppointmentDetails from '../hooks/useAppointmentDetails';
import useClients from '../hooks/useClients';
import useServices from '../hooks/useServices';
import { formatDate, formatTime } from '../utils/formatters';
import { useToast } from '../components/ToastProvider';
import { t } from '../utils/i18n';

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const { appointment, isLoading, error } = useAppointmentDetails(id);
  const { clients } = useClients();
  const { services } = useServices();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, { severity: 'error' });
    }
  }, [error, showToast]);

  if (isLoading) {
    return <p className="card muted">{t('appointmentDetails.loading')}</p>;
  }

  if (!appointment && !error) {
    return <p className="card muted">{t('appointmentDetails.notFound')}</p>;
  }

  if (error) {
    return <div className="page-content" />;
  }

  const client = clients.find((item) => item.id === appointment.clientId);
  const service = services.find((item) => item.id === appointment.serviceId);

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{t('appointmentDetails.title')}</h1>
        <p className="muted">{t('appointmentDetails.subtitle')}</p>
        <Link className="ghost" to="/appointments">
          {t('appointmentDetails.backToList')}
        </Link>
      </header>

      <section className="grid">
        <article className="card">
          <h2>{t('appointmentDetails.infoTitle')}</h2>
          <p>
            {t('appointmentDetails.clientLabel', {
              value: client?.fullName ?? t('appointmentDetails.unknownClient'),
            })}
          </p>
          <p>
            {t('appointmentDetails.serviceLabel', {
              value: service?.name ?? t('appointmentDetails.unknownService'),
            })}
          </p>
          <p>
            {t('appointmentDetails.dateLabel', {
              value: formatDate(appointment.startAt),
              time: appointment.startAt ? `, ${formatTime(appointment.startAt)}` : '',
            })}
          </p>
          <p>
            {t('appointmentDetails.endLabel', {
              value: formatDate(appointment.endAt),
              time: appointment.endAt ? `, ${formatTime(appointment.endAt)}` : '',
            })}
          </p>
          <p>
            {t('appointmentDetails.notesLabel', {
              value: appointment.notes || t('appointmentDetails.noNotes'),
            })}
          </p>
        </article>
        <article className="card">
          <h2>{t('appointmentDetails.productsTitle')}</h2>
          {appointment.usedProducts?.length ? (
            <ul className="list stacked">
              {appointment.usedProducts.map((product) => (
                <li key={product.id}>
                  <span className="list-title">{product.name}</span>
                  <span className="muted">{product.brand || t('appointmentDetails.noBrand')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t('appointmentDetails.noProducts')}</p>
          )}
        </article>
      </section>
    </div>
  );
}

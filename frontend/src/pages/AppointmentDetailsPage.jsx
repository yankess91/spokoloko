import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import useAppointmentDetails from '../hooks/useAppointmentDetails';
import useClients from '../hooks/useClients';
import useServices from '../hooks/useServices';
import { formatDate, formatTime } from '../utils/formatters';
import { useToast } from '../components/ToastProvider';
import { t } from '../utils/i18n';

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const [zoomedImage, setZoomedImage] = useState(null);
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
                <li key={product.id} className="appointment-product-item">
                  <div className="list-item-main">
                    <span className="list-title">{product.name}</span>
                    <span className="muted">{product.brand || t('appointmentDetails.noBrand')}</span>
                  </div>
                  {product.imageUrl ? (
                    <button
                      type="button"
                      className="thumb-button"
                      onClick={() => setZoomedImage({ src: product.imageUrl, name: product.name })}
                      title={t('appointmentDetails.zoomImage')}
                    >
                      <img className="thumb" src={product.imageUrl} alt={product.name} />
                      <span className="thumb-overlay">
                        <ZoomInIcon fontSize="small" />
                      </span>
                    </button>
                  ) : (
                    <span className="muted">{t('appointmentDetails.noImage')}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t('appointmentDetails.noProducts')}</p>
          )}
        </article>
      </section>

      {zoomedImage ? (
        <div className="image-zoom-backdrop" onClick={() => setZoomedImage(null)}>
          <div className="image-zoom-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="ghost icon-button image-zoom-close"
              onClick={() => setZoomedImage(null)}
            >
              <CloseIcon fontSize="small" />
              {t('modal.close')}
            </button>
            <img className="image-zoom-preview" src={zoomedImage.src} alt={zoomedImage.name} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

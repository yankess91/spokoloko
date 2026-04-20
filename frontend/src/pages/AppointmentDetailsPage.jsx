import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import useAppointmentDetails from '../hooks/useAppointmentDetails';
import useClients from '../hooks/useClients';
import useServices from '../hooks/useServices';
import AppointmentForm from '../components/AppointmentForm';
import Modal from '../components/Modal';
import { appointmentsApi } from '../api';
import { formatDate, formatTime } from '../utils/formatters';
import { useToast } from '../components/ToastProvider';
import { t } from '../utils/i18n';
import { toApiAssetUrl } from '../utils/assets';

const parseDateTime = (value) => dayjs(value);

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { appointment, isLoading, error, reload } = useAppointmentDetails(id);
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

  const stripDetailLabel = (label) => label.replace(/\{.*?\}/g, '').replace(/:\s*$/, '').trim();

  const client = clients.find((item) => item.id === appointment.clientId);
  const service = services.find((item) => item.id === appointment.serviceId);
  const editableAppointment = {
    ...appointment,
    client: client ? { id: client.id, label: client.fullName, isActive: client.isActive } : null,
    service: service ? { id: service.id, label: service.name } : null,
    startAt: parseDateTime(appointment.startAt),
    endAt: parseDateTime(appointment.endAt),
    selectedProducts: (appointment.usedProducts ?? []).map((product) => ({
      id: product.id,
      label: product.brand ? `${product.name} (${product.brand})` : product.name,
    })),
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await appointmentsApi.update(appointment.id, payload);
      await reload();
      setIsEditModalOpen(false);
      showToast(t('appointmentDetails.toastUpdated'));
    } catch (err) {
      showToast(err.message ?? t('appointmentDetails.toastUpdateError'), { severity: 'error' });
      return false;
    } finally {
      setIsSubmitting(false);
    }

    return true;
  };

  return (
    <div className="page-content">
      <header className="section-header detail-header modern-surface">
        <div className="detail-header-top">
          <span className="detail-badge is-accent">
            <EventAvailableRoundedIcon fontSize="inherit" />
            {formatDate(appointment.startAt)}
          </span>
          {appointment.startAt ? <span className="detail-badge is-muted">{formatTime(appointment.startAt)}</span> : null}
        </div>

        <h1>{t('appointmentDetails.title')}</h1>
        <p className="muted">{t('appointmentDetails.subtitle')}</p>
        <div className="section-actions detail-actions">
          <Link className="ghost" to="/appointments">
            <ArrowBackRoundedIcon fontSize="small" />
            {t('appointmentDetails.backToList')}
          </Link>
          <button type="button" className="secondary" onClick={() => setIsEditModalOpen(true)}>
            <EditOutlinedIcon fontSize="small" />
            {t('appointmentDetails.edit')}
          </button>
        </div>
      </header>

      <section className="grid detail-grid">
        <article className="card detail-card">
          <h2>{t('appointmentDetails.infoTitle')}</h2>
          <dl className="detail-fields">
            <div className="detail-field-item">
              <dt>
                <PersonRoundedIcon fontSize="small" />
                {t('appointmentDetails.clientLabel')}
              </dt>
              <dd>
                {client ? <Link to={`/clients/${client.id}`}>{client.fullName}</Link> : t('appointmentDetails.unknownClient')}
              </dd>
            </div>
            <div className="detail-field-item">
              <dt>
                <SpaRoundedIcon fontSize="small" />
                {stripDetailLabel(t('appointmentDetails.serviceLabel', { value: '' }))}
              </dt>
              <dd>{service?.name ?? t('appointmentDetails.unknownService')}</dd>
            </div>
            <div className="detail-field-item">
              <dt>
                <EventAvailableRoundedIcon fontSize="small" />
                {stripDetailLabel(t('appointmentDetails.dateLabel', { value: '', time: '' }))}
              </dt>
              <dd>
                {formatDate(appointment.startAt)}
                {appointment.startAt ? `, ${formatTime(appointment.startAt)}` : ''}
              </dd>
            </div>
            <div className="detail-field-item">
              <dt>
                <ScheduleRoundedIcon fontSize="small" />
                {stripDetailLabel(t('appointmentDetails.endLabel', { value: '', time: '' }))}
              </dt>
              <dd>
                {formatDate(appointment.endAt)}
                {appointment.endAt ? `, ${formatTime(appointment.endAt)}` : ''}
              </dd>
            </div>
            <div className="detail-field-item detail-field-item-notes">
              <dt>
                <DescriptionRoundedIcon fontSize="small" />
                {stripDetailLabel(t('appointmentDetails.notesLabel', { value: '' }))}
              </dt>
              <dd>{appointment.notes || t('appointmentDetails.noNotes')}</dd>
            </div>
          </dl>
        </article>
        <article className="card detail-card">
          <h2>{t('appointmentDetails.productsTitle')}</h2>
          {appointment.usedProducts?.length ? (
            <ul className="list stacked detail-stack-list">
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
                      onClick={() => setZoomedImage({ src: toApiAssetUrl(product.imageUrl), name: product.name })}
                      title={t('appointmentDetails.zoomImage')}
                    >
                      <img className="thumb" src={toApiAssetUrl(product.imageUrl)} alt={product.name} />
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

      {isEditModalOpen ? (
        <Modal title={t('appointmentDetails.editModalTitle')} onClose={() => setIsEditModalOpen(false)}>
          <AppointmentForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            defaultAppointment={editableAppointment}
            showTitle={false}
            variant="plain"
          />
        </Modal>
      ) : null}
    </div>
  );
}

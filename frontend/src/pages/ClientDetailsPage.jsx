import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import useClientDetails from '../hooks/useClientDetails';
import { appointmentsApi } from '../api';
import AppointmentForm from '../components/AppointmentForm';
import Modal from '../components/Modal';
import { useToast } from '../components/ToastProvider';
import { t } from '../utils/i18n';

export default function ClientDetailsPage() {
  const { id } = useParams();
  const { client, isLoading, error, reload } = useClientDetails(id);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const defaultClient = useMemo(
    () => (client ? { id: client.id, label: client.fullName, isActive: client.isActive } : null),
    [client]
  );

  useEffect(() => {
    if (error) {
      showToast(error, { severity: 'error' });
    }
  }, [error, showToast]);

  const handleAddAppointment = async (payload) => {
    try {
      setIsSubmitting(true);
      await appointmentsApi.create(payload);
      showToast(t('clientDetails.toastAppointmentAdded'), { severity: 'success' });
      setIsModalOpen(false);
      await reload();
    } catch (err) {
      showToast(err.message ?? t('clientDetails.toastAppointmentError'), { severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="card muted">{t('clientDetails.loading')}</p>;
  }

  if (!client && !error) {
    return <p className="card muted">{t('clientDetails.notFound')}</p>;
  }

  if (error) {
    return <div className="page-content" />;
  }

  return (
    <div className="page-content">
      <header className="section-header detail-header modern-surface">
        <div className="detail-header-top">
          <span className={`detail-badge ${client.isActive ? 'is-success' : 'is-muted'}`}>
            <PersonRoundedIcon fontSize="inherit" />
            {client.isActive ? t('clientDetails.activeStatus') : t('clientDetails.inactiveStatus')}
          </span>
          <span className="detail-badge is-muted">
            <EventAvailableRoundedIcon fontSize="inherit" />
            {client.serviceHistory?.length ?? 0}
          </span>
        </div>

        <h1>{client.fullName}</h1>
        <p className="muted">{t('clientDetails.subtitle')}</p>
        <div className="section-actions detail-actions">
          <button type="button" className="primary" onClick={() => setIsModalOpen(true)} disabled={!client.isActive}>
            {t('clientDetails.addAppointment')}
          </button>
          <Link className="ghost" to="/clients">
            <ArrowBackRoundedIcon fontSize="small" />
            {t('clientDetails.backToList')}
          </Link>
        </div>
      </header>

      <section className="grid detail-grid">
        <article className="card detail-card">
          <h2>{t('clientDetails.contactTitle')}</h2>
          <p>
            {t('clientDetails.emailLabel', {
              value: client.email || t('clientDetails.noEmail'),
            })}
          </p>
          <p>
            {t('clientDetails.phoneLabel', {
              value: client.phoneNumber || t('clientDetails.noPhone'),
            })}
          </p>
          <p>
            {t('clientDetails.notesLabel', {
              value: client.notes || t('clientDetails.noNotes'),
            })}
          </p>
          <p>
            {t('clientDetails.statusLabel', {
              value: client.isActive ? t('clientDetails.activeStatus') : t('clientDetails.inactiveStatus'),
            })}
          </p>
        </article>
        <article className="card detail-card">
          <h2>{t('clientDetails.serviceHistory')}</h2>
          {!client.isActive ? (
            <p className="muted">{t('clientsPage.statusInactive')}</p>
          ) : client.serviceHistory?.length ? (
            <ul className="list stacked detail-stack-list">
              {client.serviceHistory.map((history) => (
                <li key={history.appointmentId}>
                  <span className="list-title">{history.service?.name || t('clientDetails.unknownService')}</span>
                  <span className="muted">
                    {history.startAt
                      ? new Date(history.startAt).toLocaleDateString('pl-PL')
                      : t('clientDetails.noDate')}
                  </span>
                  <span className="muted">
                    {t('clientDetails.historyNotesLabel', {
                      value: history.notes || t('clientDetails.noNotes'),
                    })}
                  </span>
                  {history.usedProducts?.length ? (
                    <ul className="list stacked detail-stack-list">
                      {history.usedProducts.map((product) => (
                        <li key={product.id} className="appointment-product-item">
                          <div className="list-item-main">
                            <Link className="list-title" to={`/products/${product.id}`}>
                              {product.name}
                            </Link>
                            <span className="muted">{product.brand || t('clientDetails.noBrand')}</span>
                          </div>
                          {product.imageUrl ? (
                            <button
                              type="button"
                              className="thumb-button"
                              onClick={() =>
                                setZoomedImage({
                                  src: product.imageUrl,
                                  name: product.name,
                                })
                              }
                              title={t('clientDetails.zoomImage')}
                            >
                              <img className="thumb" src={product.imageUrl} alt={product.name} />
                              <span className="thumb-overlay">
                                <ZoomInIcon fontSize="small" />
                              </span>
                            </button>
                          ) : (
                            <span className="muted">{t('clientDetails.noImage')}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="muted">{t('clientDetails.noProducts')}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t('clientDetails.noServiceHistory')}</p>
          )}
        </article>
      </section>
      {isModalOpen ? (
        <Modal title={t('clientDetails.modalTitle')} onClose={() => setIsModalOpen(false)}>
          <AppointmentForm
            onSubmit={handleAddAppointment}
            isSubmitting={isSubmitting}
            defaultClient={defaultClient}
            clientLocked
            showTitle={false}
            variant="plain"
          />
        </Modal>
      ) : null}

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

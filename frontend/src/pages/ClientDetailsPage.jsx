import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

  const defaultClient = useMemo(
    () => (client ? { id: client.id, label: client.fullName } : null),
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
      <header className="section-header">
        <h1>{client.fullName}</h1>
        <p className="muted">{t('clientDetails.subtitle')}</p>
        <div className="section-actions">
          <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
            {t('clientDetails.addAppointment')}
          </button>
          <Link className="ghost" to="/clients">
            {t('clientDetails.backToList')}
          </Link>
        </div>
      </header>

      <section className="grid">
        <article className="card">
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
              value: client.isActive
                ? t('clientDetails.activeStatus')
                : t('clientDetails.inactiveStatus'),
            })}
          </p>
        </article>
        <article className="card">
          <h2>{t('clientDetails.recentProducts')}</h2>
          {client.usedProducts?.length ? (
            <ul className="list stacked">
              {client.usedProducts.map((product) => (
                <li key={product.id}>
                  <span className="list-title">{product.name}</span>
                  <span className="muted">{product.notes || t('clientDetails.noProductNotes')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t('clientDetails.noProducts')}</p>
          )}
        </article>
        <article className="card">
          <h2>{t('clientDetails.serviceHistory')}</h2>
          {client.serviceHistory?.length ? (
            <ul className="list stacked">
              {client.serviceHistory.map((history) => (
                <li key={history.appointmentId}>
                  <span className="list-title">
                    {history.service?.name || t('clientDetails.unknownService')}
                  </span>
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
                    <div className="chips">
                      {history.usedProducts.map((product) => (
                        <span key={product.id} className="chip">
                          {product.name}
                        </span>
                      ))}
                    </div>
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
    </div>
  );
}

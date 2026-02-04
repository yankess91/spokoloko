import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useClientDetails from '../hooks/useClientDetails';
import { appointmentsApi } from '../api';
import AppointmentForm from '../components/AppointmentForm';
import Modal from '../components/Modal';
import { useToast } from '../components/ToastProvider';

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
      showToast('Wizyta została dodana.', { severity: 'success' });
      setIsModalOpen(false);
      await reload();
    } catch (err) {
      showToast(err.message ?? 'Nie udało się dodać wizyty.', { severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="card muted">Ładowanie profilu klientki...</p>;
  }

  if (!client && !error) {
    return <p className="card muted">Nie znaleziono profilu klientki.</p>;
  }

  if (error) {
    return <div className="page-content" />;
  }

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{client.fullName}</h1>
        <p className="muted">Szczegóły profilu klientki.</p>
        <div className="section-actions">
          <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
            Dodaj wizytę
          </button>
          <Link className="ghost" to="/clients">
            Wróć do listy
          </Link>
        </div>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Dane kontaktowe</h2>
          <p>Email: {client.email || 'Brak emaila'}</p>
          <p>Telefon: {client.phoneNumber || 'Brak telefonu'}</p>
          <p>Uwagi: {client.notes || 'Brak uwag'}</p>
          <p>Status: {client.isActive ? 'Aktywna klientka' : 'Nieaktywna klientka'}</p>
        </article>
        <article className="card">
          <h2>Ostatnio użyte produkty</h2>
          {client.usedProducts?.length ? (
            <ul className="list stacked">
              {client.usedProducts.map((product) => (
                <li key={product.id}>
                  <span className="list-title">{product.name}</span>
                  <span className="muted">{product.notes || 'Brak notatek'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Brak zapisanych produktów.</p>
          )}
        </article>
        <article className="card">
          <h2>Historia usług</h2>
          {client.serviceHistory?.length ? (
            <ul className="list stacked">
              {client.serviceHistory.map((history) => (
                <li key={history.appointmentId}>
                  <span className="list-title">{history.service?.name || 'Nieznana usługa'}</span>
                  <span className="muted">
                    {history.startAt
                      ? new Date(history.startAt).toLocaleDateString('pl-PL')
                      : 'Brak daty'}
                  </span>
                  <span className="muted">Uwagi: {history.notes || 'Brak notatek'}</span>
                  {history.usedProducts?.length ? (
                    <div className="chips">
                      {history.usedProducts.map((product) => (
                        <span key={product.id} className="chip">
                          {product.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="muted">Brak zapisanych produktów.</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Brak historii usług.</p>
          )}
        </article>
      </section>
      {isModalOpen ? (
        <Modal title="Dodaj wizytę" onClose={() => setIsModalOpen(false)}>
          <AppointmentForm
            onSubmit={handleAddAppointment}
            isSubmitting={isSubmitting}
            defaultClient={defaultClient}
            clientLocked
          />
        </Modal>
      ) : null}
    </div>
  );
}

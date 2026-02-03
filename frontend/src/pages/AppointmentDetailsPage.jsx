import { Link, useParams } from 'react-router-dom';
import useAppointmentDetails from '../hooks/useAppointmentDetails';
import useClients from '../hooks/useClients';
import useServices from '../hooks/useServices';
import { formatDate, formatTime } from '../utils/formatters';

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const { appointment, isLoading, error } = useAppointmentDetails(id);
  const { clients } = useClients();
  const { services } = useServices();

  if (isLoading) {
    return <p className="card muted">Ładowanie wizyty...</p>;
  }

  if (error) {
    return <p className="card error">{error}</p>;
  }

  if (!appointment) {
    return <p className="card muted">Nie znaleziono wizyty.</p>;
  }

  const client = clients.find((item) => item.id === appointment.clientId);
  const service = services.find((item) => item.id === appointment.serviceId);

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>Wizyta</h1>
        <p className="muted">Szczegóły zaplanowanej wizyty.</p>
        <Link className="ghost" to="/appointments">
          Wróć do listy
        </Link>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Informacje</h2>
          <p>Klientka: {client?.fullName ?? 'Nieznana klientka'}</p>
          <p>Usługa: {service?.name ?? 'Nieznana usługa'}</p>
          <p>
            Data: {formatDate(appointment.startAt)}
            {appointment.startAt ? `, ${formatTime(appointment.startAt)}` : null}
          </p>
          <p>
            Koniec: {formatDate(appointment.endAt)}
            {appointment.endAt ? `, ${formatTime(appointment.endAt)}` : null}
          </p>
          <p>Notatki: {appointment.notes || 'Brak notatek'}</p>
        </article>
        <article className="card">
          <h2>Użyte produkty</h2>
          {appointment.usedProducts?.length ? (
            <ul className="list stacked">
              {appointment.usedProducts.map((product) => (
                <li key={product.id}>
                  <span className="list-title">{product.name}</span>
                  <span className="muted">{product.brand || 'Brak marki'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Brak zapisanych produktów.</p>
          )}
        </article>
      </section>
    </div>
  );
}

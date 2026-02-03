import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '../utils/formatters';

export default function AppointmentList({ appointments, clientsById, servicesById, isLoading }) {
  return (
    <article className="card">
      <header className="card-header">
        <h2>Wizyty</h2>
      </header>
      {isLoading ? (
        <p className="muted">Ładowanie wizyt...</p>
      ) : appointments.length === 0 ? (
        <p className="muted">Brak wizyt do wyświetlenia.</p>
      ) : (
        <ul className="list stacked">
          {appointments.map((appointment) => {
            const client = clientsById.get(appointment.clientId);
            const service = servicesById.get(appointment.serviceId);
            return (
              <li key={appointment.id}>
                <Link className="list-title" to={`/appointments/${appointment.id}`}>
                  {service?.name ?? 'Nieznana usługa'}
                </Link>
                <span className="list-meta">
                  {formatDate(appointment.startAt)} · {formatTime(appointment.startAt)}
                </span>
                <span className="muted">{client?.fullName ?? 'Nieznana klientka'}</span>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

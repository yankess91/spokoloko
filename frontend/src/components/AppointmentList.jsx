import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '../utils/formatters';

export default function AppointmentList({ appointments, clientsById, servicesById, isLoading }) {
  if (isLoading) {
    return <p className="muted">Ładowanie wizyt...</p>;
  }

  if (appointments.length === 0) {
    return <p className="muted">Brak wizyt do wyświetlenia.</p>;
  }

  return (
    <div className="data-grid data-grid-appointments" role="table" aria-label="Lista wizyt">
      <div className="data-grid-row data-grid-header" role="row">
        <span className="data-grid-cell" role="columnheader">
          Wizyta
        </span>
        <span className="data-grid-cell" role="columnheader">
          Termin
        </span>
        <span className="data-grid-cell" role="columnheader">
          Klientka
        </span>
        <span className="data-grid-cell" role="columnheader">
          Akcje
        </span>
      </div>
      {appointments.map((appointment) => {
        const client = clientsById.get(appointment.clientId);
        const service = servicesById.get(appointment.serviceId);
        return (
          <div key={appointment.id} className="data-grid-row" role="row">
            <div className="data-grid-cell" role="cell">
              <div className="data-grid-title">{service?.name ?? 'Nieznana usługa'}</div>
              <div className="data-grid-meta">{appointment.notes || 'Brak notatek'}</div>
            </div>
            <div className="data-grid-cell" role="cell">
              <span className="data-grid-title">{formatDate(appointment.startAt)}</span>
              <span className="data-grid-meta">{formatTime(appointment.startAt)}</span>
            </div>
            <div className="data-grid-cell" role="cell">
              <span className="data-grid-title">{client?.fullName ?? 'Nieznana klientka'}</span>
              <span className="data-grid-meta">
                {client?.email || client?.phoneNumber || 'Brak kontaktu'}
              </span>
            </div>
            <div className="data-grid-cell data-grid-actions" role="cell">
              <Link className="ghost" to={`/appointments/${appointment.id}`}>
                Szczegóły
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

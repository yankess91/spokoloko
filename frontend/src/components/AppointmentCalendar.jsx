import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '../utils/formatters';

export default function AppointmentCalendar({
  appointments,
  clientsById,
  servicesById,
  isLoading,
  linkBase
}) {
  const grouped = appointments.reduce((acc, appointment) => {
    const key = formatDate(appointment.startAt);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(appointment);
    return acc;
  }, {});

  const days = Object.entries(grouped).map(([date, items]) => ({
    date,
    items: items.sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
  }));

  return (
    <section className="section calendar">
      <header className="section-header">
        <h2>Kalendarz wizyt</h2>
        <p className="muted">Szybki podgląd terminów z podziałem na dni.</p>
      </header>
      {isLoading ? (
        <p className="muted">Ładowanie wizyt...</p>
      ) : days.length === 0 ? (
        <p className="muted">Brak zaplanowanych wizyt.</p>
      ) : (
        <div className="calendar-grid">
          {days.map((day) => (
            <div key={day.date} className="calendar-day">
              <p className="calendar-date">{day.date}</p>
              <div className="slots">
                {day.items.map((appointment) => {
                  const client = clientsById.get(appointment.clientId);
                  const service = servicesById.get(appointment.serviceId);
                  return (
                    <div key={appointment.id} className="slot-details">
                      <span className="slot-time">{formatTime(appointment.startAt)}</span>
                      {linkBase ? (
                        <Link to={`${linkBase}/${appointment.id}`}>
                          {service?.name ?? 'Nieznana usługa'}
                        </Link>
                      ) : (
                        <span>{service?.name ?? 'Nieznana usługa'}</span>
                      )}
                      <span className="muted">{client?.fullName ?? 'Nieznana klientka'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

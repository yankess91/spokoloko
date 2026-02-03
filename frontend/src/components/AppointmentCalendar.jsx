const formatDate = (value) =>
  new Date(value).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

const formatTime = (value) =>
  new Date(value).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  });

export default function AppointmentCalendar({ appointments, clientsById, servicesById, isLoading }) {
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
    <section className="card calendar">
      <h2>Kalendarz wizyt</h2>
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
                      <span>{service?.name ?? 'Nieznana usługa'}</span>
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

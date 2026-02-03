import { useState } from 'react';

export default function AppointmentForm({
  clients = [],
  services = [],
  onSubmit,
  isSubmitting
}) {
  const [formState, setFormState] = useState({
    clientId: '',
    serviceId: '',
    startAt: '',
    endAt: '',
    notes: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit?.({
      clientId: formState.clientId,
      serviceId: formState.serviceId,
      startAt: new Date(formState.startAt).toISOString(),
      endAt: new Date(formState.endAt).toISOString(),
      notes: formState.notes
    });
    setFormState({ clientId: '', serviceId: '', startAt: '', endAt: '', notes: '' });
  };

  return (
    <article className="card">
      <h2>Zaplanuj wizytę</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Klientka
          <select name="clientId" value={formState.clientId} onChange={handleChange} required>
            <option value="">Wybierz klientkę</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.fullName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Usługa
          <select name="serviceId" value={formState.serviceId} onChange={handleChange} required>
            <option value="">Wybierz usługę</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Start wizyty
          <input
            name="startAt"
            type="datetime-local"
            value={formState.startAt}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Koniec wizyty
          <input
            name="endAt"
            type="datetime-local"
            value={formState.endAt}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Notatki
          <textarea
            name="notes"
            placeholder="Uwagi do wizyty"
            rows="3"
            value={formState.notes}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz wizytę'}
        </button>
      </form>
    </article>
  );
}

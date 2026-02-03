import { useState } from 'react';

export default function ClientForm({ onSubmit, isSubmitting }) {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    notes: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit?.(formState);
    setFormState({ fullName: '', email: '', phoneNumber: '', notes: '' });
  };

  return (
    <article className="card">
      <h2>Dodaj użytkowniczkę</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Imię i nazwisko
          <input
            name="fullName"
            placeholder="np. Anna Nowak"
            value={formState.fullName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="anna@example.com"
            value={formState.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Telefon
          <input
            name="phoneNumber"
            placeholder="+48 600 000 000"
            value={formState.phoneNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          Uwagi
          <textarea
            name="notes"
            placeholder="Preferencje, alergie, ważne informacje"
            rows="3"
            value={formState.notes}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz profil'}
        </button>
      </form>
    </article>
  );
}

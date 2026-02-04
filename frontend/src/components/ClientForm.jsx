import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function ClientForm({ onSubmit, isSubmitting, showTitle = true, variant = 'card' }) {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    notes: '',
    isActive: true
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (event) => {
    const { checked } = event.target;
    setFormState((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit?.(formState);
    setFormState({ fullName: '', email: '', phoneNumber: '', notes: '', isActive: true });
  };

  const formContent = (
    <>
      {showTitle ? <h2>Dodaj użytkowniczkę</h2> : null}
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
        <div className="form-field">
          <span className="form-label">Status klientki</span>
          <FormControlLabel
            control={<Switch checked={formState.isActive} onChange={handleStatusChange} />}
            label={formState.isActive ? 'Aktywna klientka' : 'Nieaktywna klientka'}
          />
        </div>
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz profil'}
        </button>
      </form>
    </>
  );

  if (variant === 'card') {
    return <article className="card">{formContent}</article>;
  }

  return <div>{formContent}</div>;
}

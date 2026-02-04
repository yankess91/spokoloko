import { useState } from 'react';

export default function ProductForm({ onSubmit, isSubmitting, showTitle = true, variant = 'card' }) {
  const [formState, setFormState] = useState({
    name: '',
    brand: '',
    notes: '',
    imageUrl: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit?.(formState);
    setFormState({ name: '', brand: '', notes: '', imageUrl: '' });
  };

  const formContent = (
    <>
      {showTitle ? <h2>Dodaj produkt</h2> : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nazwa produktu
          <input
            name="name"
            placeholder="np. Olej arganowy"
            value={formState.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Marka
          <input
            name="brand"
            placeholder="np. Moroccanoil"
            value={formState.brand}
            onChange={handleChange}
          />
        </label>
        <label>
          Notatki
          <textarea
            name="notes"
            placeholder="Dodatkowe informacje"
            rows="3"
            value={formState.notes}
            onChange={handleChange}
          />
        </label>
        <label>
          Zdjęcie (link)
          <input
            name="imageUrl"
            type="url"
            placeholder="https://..."
            value={formState.imageUrl}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz produkt'}
        </button>
      </form>
    </>
  );

  if (variant === 'card') {
    return <article className="card">{formContent}</article>;
  }

  return <div>{formContent}</div>;
}

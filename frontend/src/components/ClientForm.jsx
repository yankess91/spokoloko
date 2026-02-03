export default function ClientForm() {
  return (
    <article className="card">
      <h2>Profil klienta</h2>
      <form className="form">
        <label>
          Imię i nazwisko
          <input placeholder="np. Anna Nowak" />
        </label>
        <label>
          Email
          <input type="email" placeholder="anna@example.com" />
        </label>
        <label>
          Telefon
          <input placeholder="+48 600 000 000" />
        </label>
        <label>
          Ostatnio użyte produkty
          <textarea placeholder="np. olej arganowy" rows="3" />
        </label>
        <button type="button" className="primary">Zapisz profil</button>
      </form>
    </article>
  );
}

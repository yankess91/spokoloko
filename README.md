# System rezerwacyjny - salon braiderski

Projekt zawiera prosty backend w C# (ASP.NET Core Web API) oraz frontend w React, przygotowane zgodnie z zasadami SOLID i bez modułu płatności.

## Backend (C#)

**Zakres funkcji:**
- tworzenie profilu klienta,
- dodawanie użytych produktów do profilu klienta,
- lista produktów,
- lista usług,
- kalendarz wizyt (terminy/spotkania).

**Uruchomienie:**
```bash
cd backend/BraiderskiReservation.Api

dotnet restore

dotnet run
```

Po uruchomieniu dostępne jest Swagger UI pod `https://localhost:5001/swagger` lub `http://localhost:5000/swagger`.

### Migracje SQL
Dla istniejących baz danych, po wdrożeniu zmian schematu uruchom skrypty z katalogu:
`backend/BraiderskiReservation.Api/database/migrations`

Przykład (PostgreSQL):
```bash
psql "$DATABASE_URL" -f backend/BraiderskiReservation.Api/database/migrations/20260205_add_product_price_and_shop_url.sql
```

## Frontend (React)

**Uruchomienie:**
```bash
cd frontend
npm install
npm run dev
```

UI zawiera podstawowe sekcje: profil klienta, lista usług, lista produktów oraz kalendarz wizyt.

### Notatka o stylach UI
- Główne tokeny kolorów/typografii i layoutu są w `frontend/src/styles.css` (sekcja `:root`),
  z podstawowymi zmiennymi (`--bg`, `--surface`, `--text`, `--muted`, `--border`, `--accent`).
- Komponenty/stylowanie: `card`, `section`, `grid`, `primary`, `secondary`, `ghost`, `link-button`
  oraz globalne style linków i focus-visible.
- Layout dashboardu i spacing opierają się o klasy `page`, `page-content` i `section`.

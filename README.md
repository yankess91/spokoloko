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
cp .env.example .env
cd backend/BraiderskiReservation.Api

dotnet restore

dotnet run
```

Backend podczas startu wczytuje plik `.env` z głównego katalogu repozytorium i traktuje go jako dodatkowe źródło konfiguracji. Dla zachowania kompatybilności pola `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER` oraz `POSTGRES_PASSWORD` są automatycznie składane do `ConnectionStrings:Default`. Możesz też podawać standardowe klucze ASP.NET Core w formacie `NazwaSekcji__Klucz`.

Po uruchomieniu dostępne jest Swagger UI pod `https://localhost:5001/swagger` lub `http://localhost:5000/swagger`.

### Schemat bazy i seed
Aktualny stan schematu startowego jest utrzymywany bezpośrednio w pliku:
`backend/BraiderskiReservation.Api/database/seed-data.sql`

Repozytorium nie przechowuje już historycznych migracji SQL — od tego momentu stan początkowy bazy jest budowany od zera na podstawie tego pliku.
Jeżeli aktualizujesz istniejącą bazę danych, użyj skryptów z katalogu `backend/BraiderskiReservation.Api/database/migrations`.

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

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

### Schemat bazy i migracje (EF Core)
Źródłem prawdy dla schematu bazy są **wyłącznie migracje EF Core** w projekcie:
`backend/BraiderskiReservation.Infrastructure/Data/Migrations`.

`seed-data.sql` służy wyłącznie jako opcjonalny seed danych developerskich (bez tworzenia struktury tabel).

#### Komendy EF Core CLI
Uruchamiaj z katalogu głównego repozytorium:

```bash
# dodanie nowej migracji
dotnet ef migrations add <NazwaMigracji> \
  --project backend/BraiderskiReservation.Infrastructure \
  --startup-project backend/BraiderskiReservation.Api

# lista migracji
dotnet ef migrations list \
  --project backend/BraiderskiReservation.Infrastructure \
  --startup-project backend/BraiderskiReservation.Api

# aktualizacja bazy do najnowszej migracji
dotnet ef database update \
  --project backend/BraiderskiReservation.Infrastructure \
  --startup-project backend/BraiderskiReservation.Api

# lokalny reset (usuwa bazę i odtwarza schemat wyłącznie z migracji EF Core)
dotnet ef database drop --force --no-build \
  --project backend/BraiderskiReservation.Infrastructure \
  --startup-project backend/BraiderskiReservation.Api

dotnet ef database update \
  --project backend/BraiderskiReservation.Infrastructure \
  --startup-project backend/BraiderskiReservation.Api

# kontrola wpisów migracji w __EFMigrationsHistory
psql "Host=localhost;Port=5432;Database=spokoloko;Username=spokoloko;Password=spokoloko" \
  -c 'SELECT migration_id, product_version FROM "__EFMigrationsHistory" ORDER BY migration_id;'
```

Jeżeli lokalna baza była tworzona wcześniej poza EF Core (pusta tabela `__EFMigrationsHistory` przy istniejącym schemacie), wykonaj powyższy reset, żeby od teraz schema była budowana tylko przez migracje.

Domyślnie aplikacja może automatycznie wykonać migracje na starcie (`Database:ApplyMigrationsOnStartup=true`).

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

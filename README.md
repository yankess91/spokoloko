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

## Frontend (React)

**Uruchomienie:**
```bash
cd frontend
npm install
npm run dev
```

UI zawiera podstawowe sekcje: profil klienta, lista usług, lista produktów oraz kalendarz wizyt.

### Notatka o stylach UI
- Główne tokeny kolorów/typografii i layoutu są w `frontend/src/styles.css` (sekcja `:root`).
- Komponenty/stylowanie: `card`, `card-header`, `list`, `list-meta`, `primary`, `secondary`, `ghost` oraz globalne style linków i focus-visible.
- Layout dashboardu i spacing opierają się o klasy `page` oraz `page-content`.

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

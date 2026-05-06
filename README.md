# Guest Registration App

Guest Registration App with Go backend dan React frontend.

## Tech Stack

- **Backend**: Go, Gin, SQLite (`modernc.org/sqlite`)
- **Frontend**: React + TypeScript, Vite, Tailwind CSS, Axios

## Prerequisites

- Go 1.21+
- Node.js 18+

## Setup

### Backend

```bash
cd backend
go mod tidy
go run main.go
```

Server run in `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App run in `http://localhost:5173`.

## Project Structure

```
guest-registration/
├── backend/
│   ├── main.go
│   ├── database/
│   │   └── database.go
│   ├── models/
│   │   └── guest.go
│   ├── handlers/
│   │   └── guest.go
│   └── repository/
│       └── guest.go
└── frontend/
    └── src/
        ├── pages/
        │   ├── GuestFormPage.tsx
        │   └── GuestListPage.tsx
        ├── services/
        │   └── api.ts
        └── App.tsx
```

## Notes

- Database (`guests.db`) is created automatically on first run
- uploaded ID card is saved in `backend/uploads/`
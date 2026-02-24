# Hostel Management System (Full Stack)

## Project Structure

- `frontend/` - Next.js (App Router + TypeScript)
- `backend/` - Express + TypeORM + JWT auth
- `database/` - PostgreSQL Docker Compose setup

## 1) Run PostgreSQL

```bash
cd database
docker compose up -d
```

## 2) Configure Backend

```bash
cd ../backend
cp .env.example .env
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### Backend Environment Variables

- `DATABASE_URL` (required)
- `JWT_SECRET` (required)
- `PORT` (default `5000`)
- `FRONTEND_URL` (default `http://localhost:3000`)

Default seeded admin:
- email: `admin@hostel.com`
- password: `admin123`
- role: `ADMIN`

## 3) Configure Frontend

```bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Auth APIs

- `POST /api/auth/register` - student registration only
- `POST /api/auth/login` - requires `role` (`ADMIN` or `STUDENT`) and returns JWT + user
- `GET /api/admin/dashboard` - ADMIN only (Bearer token)
- `GET /api/student/dashboard` - STUDENT only (Bearer token)

## Behavior

- Students can register and login.
- Student registration captures `phoneNumber`, `address`, and `dateOfBirth`.
- Admin can login with seeded credentials.
- Login portal role must match account role (student cannot log in through admin portal).
- JWT stored in `localStorage` (demo mode).
- Frontend redirects by role:
  - `ADMIN -> /admin/dashboard`
  - `STUDENT -> /student/dashboard`

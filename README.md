# CampusBazaar

CampusBazaar is a full-stack marketplace app for college campuses. Students can sign up with OTP verification, list products or services, browse listings, and manage accounts from a mobile app.

## Tech Stack

- Mobile: React Native + Expo + React Navigation + React Query
- Backend: Node.js + Express
- Database: PostgreSQL + Prisma ORM
- Auth: JWT with OTP-based email verification and password reset
- Email: Nodemailer

## Repository Structure

```text
CampusBazaar/
├── backend/                # Express + Prisma API
│   ├── prisma/
│   └── src/
├── mobile/                 # Expo React Native app
└── README.md
```

## Features

- Email/password signup with OTP email verification
- Login with JWT token-based authentication
- Forgot password and OTP-based password reset
- Create, browse, search, and filter listings
- Listing categories and subcategories
- Mobile-first UI with iOS/Android/Web support via Expo

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL running locally or remotely
- Expo CLI via npx (already included through project scripts)

## Environment Variables

Create `backend/.env` with the following values:

```env
# Server
PORT=3000

# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME?schema=public"

# JWT
JWT_SECRET="replace-with-a-strong-secret"
JWT_EXPIRES_IN="7d"

# Email (for OTP)
EMAIL_SERVICE=gmail
EMAIL_USER="you@example.com"
EMAIL_PASS="your-app-password"
```

Notes:
- Use an app password if you are using Gmail.
- Never commit `.env` files. This repository is configured to ignore them.

## Installation

From the project root:

```bash
# Backend deps
cd backend
npm install

# Mobile deps
cd ../mobile
npm install
```

## Database Setup (Prisma)

From `backend/`:

```bash
npx prisma generate
npx prisma migrate dev
```

Optional:

```bash
npx prisma studio
```

## Run the Project

### 1) Start Backend

From `backend/`:

```bash
npm run dev
```

Backend runs on `http://localhost:3000` by default.

### 2) Start Mobile App

From `mobile/`:

```bash
npm start
```

Then choose:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web

## API Base URL Behavior (Mobile)

The mobile app currently uses:

- iOS: `http://127.0.0.1:3000/api`
- Android emulator: `http://10.0.2.2:3000/api`

If you test on a physical phone, update the base URL in `mobile/src/services/api.js` to your machine's LAN IP.

## API Overview

Base path: `/api`

Auth routes:
- `POST /auth/signup`
- `POST /auth/verify-otp`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Listing routes:
- `POST /listings` (auth required via `x-auth-token`)
- `GET /listings`
- `GET /listings/:id`
- `DELETE /listings/:id` (auth required)

## Useful Scripts

Backend (`backend/package.json`):

```bash
npm run dev
npm start
npm run prisma:generate
```

Mobile (`mobile/package.json`):

```bash
npm start
npm run android
npm run ios
npm run web
```

## Security Checklist

- Keep `.env` local only
- Rotate secrets immediately if they were ever committed
- Use a strong `JWT_SECRET`
- Restrict CORS in production

## Deployment Notes

Before deploying:

- Replace development API base URLs with environment-specific URLs
- Set production `DATABASE_URL`
- Configure trusted email provider credentials
- Run Prisma migrations on the production database

## License

This project is currently unlicensed. Add a LICENSE file if you plan to open-source it publicly.

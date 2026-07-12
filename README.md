# Interview Prep

A full-stack interview practice application that helps users sign up, create interview sessions, and interact with an AI-powered interview experience.

## Features

- User authentication and protected routes
- AI-assisted interview flow
- Interview history and feedback pages
- Modern Next.js frontend with a TypeScript backend

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS, TypeScript
- Backend: Express, TypeScript, Prisma, PostgreSQL
- AI: Google Gemini

## Project Structure

- backend: Express API, Prisma models, auth, and AI services
- frontend: Next.js app router UI for authentication and interview experience

## Prerequisites

- Node.js 20+
- Bun
- PostgreSQL database
- Gemini API key

## Backend Setup

1. Go to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file in the backend folder with the following values:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   CLIENT_URL=http://localhost:3000
   PORT=5000
   BCRYPT_SALT_ROUNDS=10
   ```

4. Run Prisma migrations:
   ```bash
   bunx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   bun run dev
   ```

## Frontend Setup

1. Go to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env.local` file in the frontend folder:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

5. Open your browser at:
   ```text
   http://localhost:3000
   ```

## Useful Commands

### Backend

- `bun run dev` - start development server
- `bun run build` - build for production
- `bunx prisma migrate dev` - apply database migrations
- `bunx prisma studio` - open Prisma Studio

### Frontend

- `bun run dev` - start Next.js development server
- `bun run build` - build for production
- `bun run lint` - run ESLint

## Notes

- The backend expects a PostgreSQL database connection string via `DATABASE_URL`.
- Authentication uses JWTs and password hashing with bcrypt.
- The AI interview experience depends on a valid Gemini API key.

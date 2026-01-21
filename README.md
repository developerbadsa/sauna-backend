# Sauna Backend

Production-grade e-commerce backend using Node.js, Express, PostgreSQL, TypeScript, Prisma, and Zod.

## Architecture Overview
- **Routes → Controllers → Services → Repositories** to keep controllers thin.
- **Prisma** for DB access and migrations.
- **Zod** for request validation.
- **JWT** access + refresh tokens.
- **Centralized error handler** and consistent response format.

## Setup

### Prerequisites
- Node.js 20+
- Docker + Docker Compose

### Environment
Copy `.env.example` to `.env` and update values.

### Docker
```bash
docker-compose up --build
```

### Local Dev
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

### Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:migrate`
- `npm run prisma:deploy`
- `npm run seed`
- `npm run test`

### API Docs
Swagger UI: `http://localhost:4000/api/docs`

### Examples
See `docs/curl-examples.md`.

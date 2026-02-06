# Water Distribution Portal (WDN)

Monorepo scaffold implementing the architecture/workflow for a water distribution management platform.

## Included
- `apps/api`: Node.js + Express + TypeScript backend with modular routes.
- `apps/web`: React 18 + Vite + TypeScript frontend with Tailwind and Zustand/React Query wiring.
- `packages/shared-types`: Shared domain types consumed by both apps.
- `infra/sql/schema.sql`: PostgreSQL schema from the architecture document.
- `docker/docker-compose.yml`: Development services (Postgres, Redis, MinIO, API, Web).


## Requirements
- Node.js 20+
- npm 10+

## Quick start
```bash
npm install
npm run dev
```

API runs on `http://localhost:3001`, web runs on `http://localhost:3000`.

## Current implementation status
This repository provides a production-oriented starter with:
- JWT authentication flows (login/refresh/logout).
- Network listing/upload/detail/delete endpoints (in-memory repository adapter for bootstrapping).
- Simulation queue API contract with mocked progress updates.
- Cluster and alert endpoint skeletons.
- Frontend app shell: auth, dashboard, network list, network detail + simulation panel.

## Next steps
1. Replace in-memory repositories with PostgreSQL persistence (Prisma/Knex/Drizzle).
2. Add BullMQ workers + EPANET Python worker container integration.
3. Wire Socket.io real-time events for simulation and leak alerts.
4. Expand test coverage and CI pipeline.

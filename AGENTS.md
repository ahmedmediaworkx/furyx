# AGENTS.md

## Purpose
This repository contains a SaaS application with a Next.js frontend, a Node.js backend, and Docker-based local and production workflows. Follow the guidance below when making changes.

## Repository Layout
- Keep the frontend in a dedicated app directory such as `apps/web`.
- Keep the backend in a dedicated app directory such as `apps/api`.
- Keep shared code in `packages/` or `shared/` if the repository grows into a monorepo.
- Keep Docker assets at the repo root or under `docker/` when there are multiple service-specific files.
- Keep docs, scripts, and infra files separate from application code.

## Build Commands
- Frontend: run the Next.js production build from the frontend app directory, for example `npm run build` or `pnpm build`.
- Backend: run the Node.js build from the backend app directory, for example `npm run build` or `pnpm build`.
- Docker images: build with `docker compose build`.
- Full stack local environment: start with `docker compose up --build` when the repo uses Compose for orchestration.
- Prefer the package manager already used by the repo. Do not introduce a new one unless explicitly required.

## Testing Commands
- Frontend unit and component tests: `npm run test` or the repo equivalent from the frontend app directory.
- Backend tests: `npm run test` or the repo equivalent from the backend app directory.
- Run lint checks before submitting changes: `npm run lint`.
- Run type checks when available: `npm run typecheck`.
- Use targeted test runs for the files you changed when possible.
- If a script is missing, inspect the relevant `package.json` before inventing a new command.

## Coding Rules
- Prefer small, focused changes that match the existing code style.
- Do not rename public APIs, routes, or env vars unless the task requires it.
- Keep frontend code idiomatic for Next.js and React.
- Keep backend code modular, with controllers, services, and data access separated when the structure supports it.
- Validate inputs at the API boundary and return clear error messages.
- Avoid hard-coded secrets, environment-specific values, and inline credentials.
- Keep Dockerfiles minimal, reproducible, and cache-friendly.
- Update tests and docs when behavior changes.
- Do not add dependencies unless they are clearly needed.

## Frontend Guidelines
- Use Next.js routing and rendering patterns already established by the codebase.
- Keep UI components small and reusable.
- Prefer server-side data fetching or server components when appropriate for the app architecture.
- Ensure pages work on desktop and mobile.

## Backend Guidelines
- Keep route handlers thin and move business logic into services.
- Centralize validation, auth checks, and shared error handling.
- Make data access explicit and avoid mixing persistence logic into controllers.
- Keep API responses consistent and predictable.

## Docker Guidelines
- Each service should have a clear build context and explicit runtime command.
- Prefer multi-stage builds where appropriate.
- Do not bake secrets into images.
- Keep `docker-compose` definitions aligned with the local development flow.
- Document required environment variables in `.env.example` or equivalent.

## When Working In This Repo
- Read the relevant `package.json`, `Dockerfile`, and Compose files before changing build or runtime behavior.
- Prefer existing conventions over introducing new patterns.
- If the repository structure is incomplete, add only the minimum files needed for the task.
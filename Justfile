set shell := ["bash", "-cu"]

# Full local dev flow with interrupt-safe cleanup.
dev:
  @bash -c 'cleanup(){ just dev-clean >/dev/null 2>&1 || true; just dev-down >/dev/null 2>&1 || true; }; trap cleanup INT TERM EXIT; just dev-stack'

# Bring up DB, wait until ready, run migrations, then run client+server in parallel.
dev-stack:
  @just dev-db-up
  @just dev-db-wait
  @just dev-db-init
  @bash -c 'just dev-client & just dev-server & wait'

dev-db-up:
  docker compose up -d postgres

dev-db-wait:
  @bash -c 'until docker compose exec -T postgres pg_isready -U postgres -d commitly >/dev/null 2>&1; do echo Waiting for Postgres to become ready...; sleep 1; done'

dev-db-init:
  @bash -c 'DATABASE_URL=postgres://postgres:postgres@localhost:${COMMITLY_DB_PORT:-5433}/commitly npm --workspace server run db:migrate'

dev-server:
  npm run dev --workspace=server

dev-client:
  npm run dev --workspace=client

dev-clean:
  @bash -c "pkill -f '[t]sx watch src/main.ts' || true; pkill -f '[v]ite' || true"

dev-down:
  docker compose stop postgres

build:
  npm run build --workspaces

test:
  npm run test --workspaces

lint:
  npm run lint --workspaces

format:
  npm run format --workspaces

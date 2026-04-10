set shell := ["bash", "-cu"]

default:
  @just --list

install:
  npm install

# Full local dev flow with interrupt-safe cleanup.
dev:
  @bash -c 'cleanup(){ just dev-clean >/dev/null 2>&1 || true; just db-down >/dev/null 2>&1 || true; }; trap cleanup INT TERM EXIT; just dev-stack'

# Bring up DB, wait until ready, run migrations, then run client+server in parallel.
dev-stack:
  @just db-up
  @just db-wait
  @just db-migrate
  @bash -c 'just dev-client & just dev-server & wait'

db-up:
  docker compose up -d postgres

db-wait:
  @bash -c 'until docker compose exec -T postgres pg_isready -U postgres -d commitly >/dev/null 2>&1; do echo Waiting for Postgres to become ready...; sleep 1; done'

db-migrate:
  @bash -c 'DATABASE_URL=postgres://postgres:postgres@localhost:${COMMITLY_DB_PORT:-5433}/commitly npm --workspace server run db:migrate'

db-restart:
  @just db-down
  @just db-up
  @just db-wait

db-reset:
  docker compose down -v
  @just db-up
  @just db-wait
  @just db-migrate

db-shell:
  docker compose exec postgres psql -U postgres -d commitly

db-generate:
  npm run db:generate --workspace=server

gen-schemas:
  npm run build --workspace=@commitly/schemas

dev-server:
  npm run dev --workspace=server

dev-client:
  npm run dev --workspace=client

dev-clean:
  @bash -c "pkill -f '[t]sx watch src/main.ts' || true; pkill -f '[v]ite' || true"

db-down:
  docker compose stop postgres

build:
  npm run build --workspaces

test:
  npm run test --workspaces

lint:
  npm run lint --workspaces

format:
  npm run format --workspaces

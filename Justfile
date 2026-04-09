set shell := ["bash", "-cu"]

default:
  @just --list

install:
  npm install

# Full local dev flow with interrupt-safe cleanup.
dev:
  @bash -c 'cleanup(){ just dev-clean >/dev/null 2>&1 || true; just dev-down >/dev/null 2>&1 || true; }; trap cleanup INT TERM EXIT; just dev-stack'

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

gen: gen-schemas

db-generate:
  npm run db:generate --workspace=server

gen-schemas:
  npm run build --workspace=@commitly/schemas

dev-server:
  npm run dev --workspace=server

dev-client:
  npm run dev --workspace=client

dev-server-build:
  npm run build --workspace=server

dev-client-build:
  npm run build --workspace=client

dev-server-test:
  npm run test --workspace=server

dev-server-lint:
  npm run lint --workspace=server

dev-client-lint:
  npm run lint --workspace=client

dev-clean:
  @bash -c "pkill -f '[t]sx watch src/main.ts' || true; pkill -f '[v]ite' || true"

db-down:
  docker compose stop postgres

dev-down: db-down

dev-db-up: db-up

dev-db-wait: db-wait

dev-db-init: db-migrate

build:
  npm run build --workspaces

test:
  npm run test --workspaces

lint:
  npm run lint --workspaces

format:
  npm run format --workspaces

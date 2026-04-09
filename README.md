Commitly is a full-stack developer analytics platform that connects to your GitHub account and transforms your raw activity into meaningful personal insights.

Stack:

React frontend with a clean dashboard UI, client-side routing, and data visualizations using a charting library such as Recharts or Chart.js
Express backend serving a REST API, handling all third-party communication, and managing a PostgreSQL (or SQLite for simplicity) database for caching and storing processed data
Authentication:

GitHub OAuth 2.0 flow handled server-side, keeping secrets secure. Users log in with their GitHub account and receive a session token for subsequent requests.
Data Layer:

Pulls commit history, repository metadata, branch activity, and language usage from the GitHub REST API. Data is periodically cached in the database to avoid rate limiting and improve performance.
OpenAI Integration:

Commit messages and activity patterns are fed into the OpenAI API to generate a readable weekly narrative summary -- a short, human-friendly digest of what you worked on and how your habits looked that week.
Key Features:

Behavioral patterns: peak coding hours, most productive days, commit streaks
Repo health: active vs. neglected repositories, abandoned branches
Weekly digest: an LLM-generated narrative summary of your recent activity

## Local development setup

### Prerequisites

- Node.js and npm
- Docker and Docker Compose
- just

### First-time setup

1. Install dependencies from the repo root:

	just install

2. Create your server env file:

	cp server/.env.example server/.env

3. Fill in the GitHub OAuth values in `server/.env`:

	- `GITHUB_CLIENT_ID`
	- `GITHUB_CLIENT_SECRET`
	- `SESSION_SECRET`

### Start full dev stack

From the repo root, run:

just dev

This will:

- Start local Postgres via Docker
- Run database migrations
- Start both the Vite client and TSX server in watch mode

By default, Commitly maps Postgres to host port `5433` to avoid collisions with other local projects. You can override this with `COMMITLY_DB_PORT`.

### Useful dev commands

- Stop local Postgres: `just db-down`
- Kill local Vite/TSX processes: `just dev-clean`
- Run DB migrations: `just db-migrate`
- Generate Drizzle SQL migration files: `just db-generate`
- Reset DB volume and re-run migrations: `just db-reset`
- Build shared schemas (generation step): `just gen-schemas`
- See all available commands: `just`

### Migration workflow

- Drizzle is the source of truth for database schema.
- Typical flow for schema changes:
	1. Update schema in `server/src/db/schema.ts`
	2. Generate migration SQL with `just db-generate`
	3. Apply migrations with `just db-migrate`

If you are switching from the old in-code SQL migrator, run `just db-reset` once to recreate the local database from Drizzle migrations.

import { defineConfig } from 'drizzle-kit';

const dbPort = process.env.COMMITLY_DB_PORT ?? '5433';
const databaseUrl =
  process.env.DATABASE_URL ??
  `postgres://postgres:postgres@localhost:${dbPort}/commitly`;

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});

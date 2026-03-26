import { loadEnvFile } from 'node:process';
import postgres from 'postgres';

try {
  loadEnvFile();
} catch (err) {
  // Allow commands that pass env vars directly (for example root dev:db-init).
  const maybeErr = err as NodeJS.ErrnoException;
  if (maybeErr.code !== 'ENOENT') {
    throw err;
  }
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing required environment variable: DATABASE_URL');
}

const sql = postgres(databaseUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;

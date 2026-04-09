import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';

try {
  loadEnvFile();
} catch (err) {
  const maybeErr = err as NodeJS.ErrnoException;
  if (maybeErr.code !== 'ENOENT') {
    throw err;
  }
}

async function run() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('Missing required environment variable: DATABASE_URL');
  }

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const migrationsFolder = path.join(currentDir, '../../drizzle');

  try {
    await migrate(db, { migrationsFolder });
    console.log('Drizzle migrations completed successfully');
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

import { loadEnvFile } from "node:process";

type APIConfig = {
  baseURL: string;
  port: number;
  timeout: number;
};

type DatabaseConfig = {
  dbUrl: string;
}

type GitHubConfig = {
  clientId: string;
  clientSecret: string;
  syncCooldownMs: number;
}

type Config = {
  apiServer: APIConfig;
  db: DatabaseConfig;
  github: GitHubConfig;
  sessionSecret: string;
  clientURL: string;
};

loadEnvFile();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const cfg: Config = {
  apiServer: {
    baseURL: process.env.BASE_URL ?? 'http://localhost',
    port: parseInt(process.env.PORT ?? '8080'),
    timeout: parseInt(process.env.TIMEOUT ?? '5000'),
  },
  db: {
    dbUrl: requireEnv('DATABASE_URL'),
  },
  github: {
    clientId: requireEnv('GITHUB_CLIENT_ID'),
    clientSecret: requireEnv('GITHUB_CLIENT_SECRET'),
    syncCooldownMs: 24 * 60 * 60 * 1000,
  },
  sessionSecret: requireEnv('SESSION_SECRET'),
  clientURL: process.env.CLIENT_URL ?? 'http://localhost:5173',
};

export default cfg;

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
}

type Config = {
  apiServer: APIConfig;
  db: DatabaseConfig;
  github: GitHubConfig;
  clientURL: string;
};

loadEnvFile();

const parseEnvVariables = () => {
  const BASE_URL = process.env.BASE_URL ?? 'http://localhost';
  const PORT = process.env.PORT ?? '8080';
  const DATABASE_URL = process.env.DATABASE_URL ?? '';
  const TIMEOUT = process.env.TIMEOUT ?? '5000';
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? '';
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? '';
  const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

  return [BASE_URL, PORT, DATABASE_URL, TIMEOUT, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, CLIENT_URL];
}

const [BASE_URL, PORT, DATABASE_URL, TIMEOUT, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, CLIENT_URL] = parseEnvVariables();

const cfg: Config = {
  apiServer: {
    baseURL: BASE_URL,
    port: parseInt(PORT),
    timeout: parseInt(TIMEOUT),
  },
  db: {
    dbUrl: DATABASE_URL
  },
  github: {
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
  },
  clientURL: CLIENT_URL,
};

export default cfg;

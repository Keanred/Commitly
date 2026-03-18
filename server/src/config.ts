import { loadEnvFile } from "node:process";

type APIConfig = {
  baseURL: string;
  port: number;
  timeout: number;
};

type DatabaseConfig = {
  dbUrl: string;
}

type Config = {
  apiServer: APIConfig;
  db: DatabaseConfig;
};

loadEnvFile();

const parseEnvVariables = () => {
  const BASE_URL = process.env.BASE_URL ?? 'http://localhost';
  const PORT = process.env.PORT ?? '8080';
  const DATABASE_URL = process.env.DATABASE_URL ?? '';
  const TIMEOUT = process.env.TIMEOUT ?? '5000';

  return [BASE_URL, PORT, DATABASE_URL, TIMEOUT];
}

const [BASE_URL, PORT, DATABASE_URL, TIMEOUT] = parseEnvVariables();

const cfg: Config = {
  apiServer: {
    baseURL: BASE_URL,
    port: parseInt(PORT),
    timeout: parseInt(TIMEOUT),
  },
  db: {
    dbUrl: DATABASE_URL
  }
};

export default cfg;

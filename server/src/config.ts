type APIConfig = {
  baseURL: string;
  port: number;
  timeout: number;
};
type Config = {
  apiServer: APIConfig;
};

const cfg: Config = {
  apiServer: {
    baseURL: 'http://localhost',
    port: 8080,
    timeout: 5000,
  },
};

export default cfg;

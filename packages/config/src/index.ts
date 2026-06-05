export interface AppConfig {
  nodeEnv: string;
  apiPort: number;
  webPort: number;
  corsOrigin: string;
}

export const appConfig: AppConfig = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  apiPort: Number(process.env.API_PORT ?? 3001),
  webPort: Number(process.env.WEB_PORT ?? 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000"
};

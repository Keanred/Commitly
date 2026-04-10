import connectPgSimple from 'connect-pg-simple';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import { createServer } from 'http';
import cfg from './config';
import { client } from './db/connection';
import { requireAuth } from './middleware';
import authRouter from './routes/auth';
import commitsRouter from './routes/commits';
import metricsRouter from './routes/metrics';
import reposRouter from './routes/repos';
import summaryRouter from './routes/summary';

const PgSession = connectPgSimple(session);

const app = express();
const server = createServer(app);

app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';

app.use(
  session({
    store: new PgSession({
      conString: cfg.db.dbUrl,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: cfg.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }),
);

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

app.use('/auth', authRouter);

app.use('/api/v1/commits', requireAuth, commitsRouter);
app.use('/api/v1/repos', requireAuth, reposRouter);
app.use('/api/v1/metrics', requireAuth, metricsRouter);
app.use('/api/v1/summary', requireAuth, summaryRouter);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

server.setTimeout(cfg.apiServer.timeout);

async function start() {
  server.listen(cfg.apiServer.port, () => {
    console.log(`Server is running on port ${cfg.apiServer.port}`);
  });
}

// Graceful shutdown
function shutdown(signal: string) {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    await client.end();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

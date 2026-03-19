import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cfg from './config';
import { migrate } from './db';
import sql from './db/connection';
import authRouter from './routes/auth';
import reposRouter from './routes/repos';
import commitsRouter from './routes/commits';
import metricsRouter from './routes/metrics';
import summaryRouter from './routes/summary';
import session from 'express-session';
import { requireAuth } from './middleware';

const app = express();
const server = createServer(app);

app.use(express.json());

app.use(session({
  secret: cfg.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // set to true in production with HTTPS
}));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/auth', authRouter);

app.use('/api/v1/commits', requireAuth, commitsRouter);
app.use('/api/v1/repos', requireAuth, reposRouter);
app.use('/api/v1/metrics', requireAuth, metricsRouter);
app.use('/api/v1/summary', requireAuth, summaryRouter);

// Global error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

server.setTimeout(cfg.apiServer.timeout);

async function start() {
  await migrate();
  server.listen(cfg.apiServer.port, () => {
    console.log(`Server is running on port ${cfg.apiServer.port}`);
  });
}

// Graceful shutdown
function shutdown(signal: string) {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    await sql.end();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
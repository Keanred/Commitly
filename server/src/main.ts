import express from 'express';
import { createServer } from 'http';
import cfg from './config';
import { migrate } from './db';
import authRouter from './routes/auth';
import reposRouter from './routes/repos';
import commitsRouter from './routes/commits';
import weeklyRouter from './routes/weekly';
import session from 'express-session';
import { requireAuth } from './middleware';

const app = express();
const server = createServer(app);

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // set to true in production with HTTPS
}));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/auth', authRouter);
app.use('/api/v1/stats', requireAuth, commitsRouter);
app.use('/api/v1/stats', requireAuth, reposRouter);
app.use('/api/v1/summary', requireAuth, weeklyRouter);

server.setTimeout(cfg.apiServer.timeout);

server.listen(cfg.apiServer.port, async () => {
  await migrate();
  console.log(`Server is running on port ${cfg.apiServer.port}`);
});
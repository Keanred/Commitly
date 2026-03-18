import express from 'express';
import { createServer } from 'http';
import cfg from './config';
import authRouter from './routes/auth';
import session from 'express-session';

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

server.setTimeout(cfg.apiServer.timeout);

server.listen(cfg.apiServer.port, () => {
  console.log(`Server is running on port ${cfg.apiServer.port}`);
});
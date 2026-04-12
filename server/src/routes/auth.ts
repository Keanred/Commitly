import { Request, Response, Router } from 'express';
import { randomBytes } from 'node:crypto';
import cfg from '../config';
import { getUserById, upsertUser } from '../db/queries';
import { fetchGitHub } from '../github/client';
import { needsSync, syncUserData } from '../github/sync';
import type { User } from '../types/models';

const authRouter = Router();

async function exchangeCodeForToken(code: string): Promise<string | null> {
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: cfg.github.clientId,
      client_secret: cfg.github.clientSecret,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token ?? null;
}

async function fetchAndUpsertUser(accessToken: string): Promise<User> {
  const githubUser = await fetchGitHub(accessToken, '/user');
  return upsertUser({
    github_id: githubUser.id,
    login: githubUser.login,
    name: githubUser.name,
    avatar_url: githubUser.avatar_url,
    access_token: accessToken,
  });
}

authRouter.get('/github', (req: Request, res: Response) => {
  const state = randomBytes(16).toString('hex');
  req.session.oauthState = state;
  const params = new URLSearchParams({
    client_id: cfg.github.clientId,
    scope: 'read:user repo',
    state,
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// eslint-disable-next-line complexity
authRouter.get('/github/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!state || typeof state !== 'string' || state !== req.session.oauthState) {
    res.redirect(`${cfg.clientURL}?error=invalid_state`);
    return;
  }
  req.session.oauthState = undefined;

  if (!code || typeof code !== 'string') {
    res.redirect(`${cfg.clientURL}?error=missing_code`);
    return;
  }

  const accessToken = await exchangeCodeForToken(code);
  if (!accessToken) {
    res.redirect(`${cfg.clientURL}?error=token_exchange_failed`);
    return;
  }

  let user: User;
  try {
    user = await fetchAndUpsertUser(accessToken);
  } catch {
    res.redirect(`${cfg.clientURL}?error=github_user_fetch_failed`);
    return;
  }

  req.session.accessToken = accessToken;
  req.session.userId = user.id;

  // Background sync — only if not recently synced
  if (needsSync(user)) {
    syncUserData(user, accessToken).catch((err) => {
      console.error('Background sync error:', err);
    });
  }

  res.redirect(`${cfg.clientURL}/dashboard`);
});

authRouter.get('/me', async (req: Request, res: Response) => {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = await getUserById(req.session.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { access_token: _access_token, ...safeUser } = user;
  res.json(safeUser);
});

authRouter.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

export default authRouter;

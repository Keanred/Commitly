import { Request, Response, NextFunction, Router } from 'express';
import 'express-session';
import { sql } from '../db';
import cfg from '../config';
import type { User } from '../types/models';

const authRouter = Router();

authRouter.get("/github", (req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: cfg.github.clientId,
    scope: "read:user repo",
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

authRouter.get("/github/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    res.redirect(`${cfg.clientURL}?error=missing_code`);
    return;
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new URLSearchParams({
      client_id: cfg.github.clientId,
      client_secret: cfg.github.clientSecret,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    res.redirect(`${cfg.clientURL}?error=token_exchange_failed`);
    return;
  }

  // Fetch GitHub user profile
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!userResponse.ok) {
    res.redirect(`${cfg.clientURL}?error=github_user_fetch_failed`);
    return;
  }

  const githubUser = await userResponse.json();

  // Upsert user into database
  const [user] = await sql<User[]>`
    INSERT INTO users (github_id, login, name, avatar_url, access_token)
    VALUES (${githubUser.id}, ${githubUser.login}, ${githubUser.name}, ${githubUser.avatar_url}, ${accessToken})
    ON CONFLICT (github_id) DO UPDATE SET
      login = EXCLUDED.login,
      name = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url,
      access_token = EXCLUDED.access_token,
      updated_at = now()
    RETURNING *
  `;

  req.session.accessToken = accessToken;
  req.session.userId = user.id;

  res.redirect(`${cfg.clientURL}/dashboard`);
});

authRouter.get("/me", (req: Request, res: Response) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  sql<User[]>`SELECT id, github_id, login, name, avatar_url, created_at FROM users WHERE id = ${req.session.userId}`
    .then(([user]) => {
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    });
});

authRouter.post("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

export default authRouter;

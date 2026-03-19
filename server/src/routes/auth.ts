import { Request, Response, NextFunction, Router } from 'express';
import 'express-session';
import { sql } from '../db';
import cfg from '../config';
import type { User } from '../types/models';
import { fetchUserRepos, fetchRepoCommits, fetchRepoLanguages, fetchRepoBranches } from '../github/client';
import { upsertRepo, insertCommits, upsertLanguage, upsertBranch } from '../db/queries';

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

  // Background sync: fetch and upsert repos, commits, languages, branches
  (async () => {
    try {
      // 1. Repos
      const repos = await fetchUserRepos(accessToken);
      const upsertedRepos = await Promise.all(
        repos.map(async (repo: any) => {
          return upsertRepo({
            user_id: user.id,
            github_id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            open_issues: repo.open_issues_count,
            has_readme: false,
            default_branch: repo.default_branch,
            pushed_at: repo.pushed_at ? new Date(repo.pushed_at) : null,
            repo_created_at: repo.created_at ? new Date(repo.created_at) : null,
            repo_updated_at: repo.updated_at ? new Date(repo.updated_at) : null,
          });
        })
      );
      // 2. Commits, Languages, Branches for each repo
      for (const repo of upsertedRepos) {
        // Commits (authored by user)
        try {
          const commits = await fetchRepoCommits(accessToken, repo.full_name.split('/')[0], repo.name, user.login);
          const commitInserts = commits.map((commit: any) => ({
            user_id: user.id,
            repo_id: repo.id,
            sha: commit.sha,
            message: commit.commit?.message ?? '',
            additions: commit.stats?.additions ?? 0,
            deletions: commit.stats?.deletions ?? 0,
            committed_at: commit.commit?.author?.date ? new Date(commit.commit.author.date) : new Date(),
          }));
          await insertCommits(commitInserts);
        } catch {}
        // Languages
        try {
          const langs = await fetchRepoLanguages(accessToken, repo.full_name.split('/')[0], repo.name);
          for (const [language, bytes] of Object.entries(langs)) {
            await upsertLanguage({ repo_id: repo.id, language, bytes: Number(bytes) });
          }
        } catch {}
        // Branches
        try {
          const branches = await fetchRepoBranches(accessToken, repo.full_name.split('/')[0], repo.name);
          for (const branch of branches) {
            await upsertBranch({
              repo_id: repo.id,
              name: branch.name,
              last_commit_sha: branch.commit?.sha ?? null,
              last_commit_date: null,
              is_default: branch.name === repo.default_branch,
            });
          }
        } catch {}
      }
    } catch (err) {
      // Log but don't block login
      console.error('Background sync error:', err);
    }
  })();

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

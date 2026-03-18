import { Request, Response, NextFunction, Router } from 'express';
import 'express-session';

const authRouter = Router();

authRouter.get("/github", (req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user repo",
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

authRouter.get("/github/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code: code as string,
    }),
  });

  const data = await response.json();
  const accessToken = data.access_token;

  req.session.accessToken = accessToken;

  res.redirect("http://localhost:5173/dashboard");
});

export default authRouter;

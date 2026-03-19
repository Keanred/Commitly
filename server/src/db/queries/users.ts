import sql from '../connection';
import type { User, UserInsert } from '../../types/models';

export async function getUserById(id: number): Promise<User | null> {
  const [user] = await sql<User[]>`SELECT * FROM users WHERE id = ${id}`;
  return user || null;
}

export async function getUserByGithubId(githubId: number): Promise<User | null> {
  const [user] = await sql<User[]>`SELECT * FROM users WHERE github_id = ${githubId}`;
  return user || null;
}

export async function upsertUser(user: UserInsert): Promise<User> {
  const [result] = await sql<User[]>`
    INSERT INTO users (github_id, login, name, avatar_url, access_token)
    VALUES (${user.github_id}, ${user.login}, ${user.name}, ${user.avatar_url}, ${user.access_token})
    ON CONFLICT (github_id) DO UPDATE SET
      login = EXCLUDED.login,
      name = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url,
      access_token = EXCLUDED.access_token,
      updated_at = now()
    RETURNING *
  `;
  return result;
}

import { eq, sql } from 'drizzle-orm';
import type { User, UserInsert } from '../../types/models';
import { db } from '../connection';
import { users } from '../schema';

export async function getUserById(id: number): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user || null;
}

export async function getUserByGithubId(githubId: number): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.github_id, githubId));
  return user || null;
}

export async function updateLastSyncedAt(userId: number): Promise<void> {
  await db
    .update(users)
    .set({ last_synced_at: sql`now()` })
    .where(eq(users.id, userId));
}

export async function upsertUser(user: UserInsert): Promise<User> {
  const [result] = await db
    .insert(users)
    .values({
      github_id: user.github_id,
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      access_token: user.access_token,
    })
    .onConflictDoUpdate({
      target: users.github_id,
      set: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        access_token: user.access_token,
        updated_at: sql`now()`,
      },
    })
    .returning();

  if (!result) {
    throw new Error('Failed to upsert user');
  }

  return result;
}

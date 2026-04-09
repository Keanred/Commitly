import { eq, sql } from 'drizzle-orm';
import type { Language, LanguageInsert } from '../../types/models';
import { db } from '../connection';
import { languages } from '../schema';

export async function getLanguagesByRepo(repoId: number): Promise<Language[]> {
  return db.select().from(languages).where(eq(languages.repo_id, repoId));
}

export async function upsertLanguage(language: LanguageInsert): Promise<Language> {
  const [result] = await db
    .insert(languages)
    .values({
      repo_id: language.repo_id,
      language: language.language,
      bytes: language.bytes,
      fetched_at: sql`now()`,
    })
    .onConflictDoUpdate({
      target: [languages.repo_id, languages.language],
      set: {
        bytes: language.bytes,
        fetched_at: sql`now()`,
      },
    })
    .returning();

  if (!result) {
    throw new Error('Failed to upsert language');
  }

  return result;
}

import sql from '../connection';
import type { Language, LanguageInsert } from '../../types/models';

export async function getLanguagesByRepo(repoId: number): Promise<Language[]> {
  return sql<Language[]>`SELECT * FROM languages WHERE repo_id = ${repoId}`;
}

export async function upsertLanguage(language: LanguageInsert): Promise<Language> {
  const [result] = await sql<Language[]>`
    INSERT INTO languages (repo_id, language, bytes, fetched_at)
    VALUES (${language.repo_id}, ${language.language}, ${language.bytes}, now())
    ON CONFLICT (repo_id, language) DO UPDATE SET
      bytes = EXCLUDED.bytes,
      fetched_at = now()
    RETURNING *
  `;
  return result;
}

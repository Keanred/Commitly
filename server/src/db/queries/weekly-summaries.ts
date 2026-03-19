import sql from '../connection';
import type { WeeklySummary } from '../../types/models';

export async function getWeeklySummary(userId: number, weekStart: Date): Promise<WeeklySummary | null> {
  const [summary] = await sql<WeeklySummary[]>`SELECT * FROM weekly_summaries WHERE user_id = ${userId} AND week_start = ${weekStart}`;
  return summary || null;
}

export async function upsertWeeklySummary(summary: Omit<WeeklySummary, 'id' | 'generated_at'>): Promise<WeeklySummary> {
  const [result] = await sql<WeeklySummary[]>`
    INSERT INTO weekly_summaries (user_id, week_start, week_end, summary_text, generated_at)
    VALUES (${summary.user_id}, ${summary.week_start}, ${summary.week_end}, ${summary.summary_text}, now())
    ON CONFLICT (user_id, week_start) DO UPDATE SET
      week_end = EXCLUDED.week_end,
      summary_text = EXCLUDED.summary_text,
      generated_at = now()
    RETURNING *
  `;
  return result;
}

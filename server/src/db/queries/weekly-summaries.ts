import { and, eq, sql } from 'drizzle-orm';
import type { WeeklySummary } from '../../types/models';
import { db } from '../connection';
import { weeklySummaries } from '../schema';

function toPgDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function mapWeeklySummaryRow(row: {
  id: number;
  user_id: number;
  week_start: string;
  week_end: string;
  summary_text: string;
  generated_at: Date;
}): WeeklySummary {
  return {
    ...row,
    week_start: new Date(row.week_start),
    week_end: new Date(row.week_end),
  };
}

export async function getWeeklySummary(userId: number, weekStart: Date): Promise<WeeklySummary | null> {
  const weekStartDate = toPgDate(weekStart);
  const [summary] = await db
    .select()
    .from(weeklySummaries)
    .where(and(eq(weeklySummaries.user_id, userId), eq(weeklySummaries.week_start, weekStartDate)));

  return summary ? mapWeeklySummaryRow(summary) : null;
}

export async function upsertWeeklySummary(summary: Omit<WeeklySummary, 'id' | 'generated_at'>): Promise<WeeklySummary> {
  const [result] = await db
    .insert(weeklySummaries)
    .values({
      user_id: summary.user_id,
      week_start: toPgDate(summary.week_start),
      week_end: toPgDate(summary.week_end),
      summary_text: summary.summary_text,
      generated_at: sql`now()`,
    })
    .onConflictDoUpdate({
      target: [weeklySummaries.user_id, weeklySummaries.week_start],
      set: {
        week_end: toPgDate(summary.week_end),
        summary_text: summary.summary_text,
        generated_at: sql`now()`,
      },
    })
    .returning();

  if (!result) {
    throw new Error('Failed to upsert weekly summary');
  }

  return mapWeeklySummaryRow(result);
}

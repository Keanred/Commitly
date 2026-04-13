import { and, eq, gte, lte, sql } from 'drizzle-orm';
import type { WeeklySummary } from '../../types/models';
import { db } from '../connection';
import { commits, weeklySummaries } from '../schema';

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

// REturn aggregated stats for the target week from existing tables:
// commit count, per repo breakdown, pr counts (opened, closed, merged),
// top languages by percent, active branch count
const getWeeklyDigestData = (userId: number, weekStart: Date, weekEnd: Date) => {
  const commitCountQuery = db
    .select({ count: sql`COUNT(*)` })
    .from(commits)
    .where(
      and(
        eq(commits.user_id, userId),
        gte(commits.committed_at, weekStart),
        lte(commits.committed_at, weekEnd),
      ),
    );
  const repoBreakdownQuery = db
    .select({
      repo_id: commits.repo_id,
      count: sql`COUNT(*)`,
    })
    .from(commits)
    .where(
      and(
        eq(commits.user_id, userId),
        gte(commits.committed_at, weekStart),
        lte(commits.committed_at, weekEnd),
      ),
    )
    .groupBy(commits.repo_id);
  const prCountsQuery = db
    .select({
      state: sql`CASE WHEN merged THEN 'merged' ELSE state END`,
      count: sql`COUNT(*)`,
    })
    .from(sql`pull_requests`)
    .where(
      and(
        eq(sql`pull_requests.user_id`, userId),
        gte(sql`pull_requests.created_at`, weekStart),
        lte(sql`pull_requests.created_at`, weekEnd),
      ),
    )
    .groupBy(sql`CASE WHEN merged THEN 'merged' ELSE state END`);
  const languageBreakdownQuery = db
    .select({ language: sql`language`, bytes: sql`SUM(bytes)` })
    .from(sql`languages`)
    .where(
      and(
        eq(sql`languages.user_id`, userId),
        gte(sql`languages.updated_at`, weekStart),
        lte(sql`languages.updated_at`, weekEnd),
      ),
    )
    .groupBy(sql`language`)
    .orderBy(sql.raw(`SUM(bytes) DESC`))
    .limit(5);
  const activeBranchesQuery = db
    .select({ count: sql`COUNT(DISTINCT branches.id)` })
    .from(sql`branches`)
    .innerJoin(commits, sql`${commits.repo_id} = branches.repo_id`)
    .where(
      and(
        eq(sql`branches.user_id`, userId),
        gte(commits.committed_at, weekStart),
        lte(commits.committed_at, weekEnd),
      ),
    );

  return Promise.all([
    commitCountQuery,
    repoBreakdownQuery,
    prCountsQuery,
    languageBreakdownQuery,
    activeBranchesQuery,
  ]);
};

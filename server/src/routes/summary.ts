import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { db } from '../db/connection';
import { commits, languages, repos } from '../db/schema';

const summaryRouter = Router();

type WeeklyBar = {
  label: string;
  value: number;
};

type TechStackEntry = {
  label: string;
  percentage: number;
};

type TopContribution = {
  title: string;
  repo: string;
  repoOrg: string;
  impact: number;
};

function getCurrentWeekRange(): { weekStart: Date; weekEnd: Date } {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

summaryRouter.get('/weekly', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const { weekStart, weekEnd } = getCurrentWeekRange();

  const [dailyCommitRows, languageRows, contributionRows] = await Promise.all([
    db
      .select({
        dow: sql<number>`EXTRACT(DOW FROM ${commits.committed_at})::int`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(commits)
      .where(and(eq(commits.user_id, userId), gte(commits.committed_at, weekStart), lte(commits.committed_at, weekEnd)))
      .groupBy(sql`EXTRACT(DOW FROM ${commits.committed_at})`),
    db
      .select({
        language: languages.language,
        bytes: sql<number>`SUM(${languages.bytes})::int`,
      })
      .from(languages)
      .innerJoin(repos, eq(languages.repo_id, repos.id))
      .where(eq(repos.user_id, userId))
      .groupBy(languages.language)
      .orderBy(desc(sql`SUM(${languages.bytes})`))
      .limit(5),
    db
      .select({
        title: commits.message,
        fullName: repos.full_name,
        impact: sql<number>`(${commits.additions} + ${commits.deletions})::int`,
        committedAt: commits.committed_at,
      })
      .from(commits)
      .innerJoin(repos, eq(commits.repo_id, repos.id))
      .where(and(eq(commits.user_id, userId), gte(commits.committed_at, weekStart), lte(commits.committed_at, weekEnd)))
      .orderBy(desc(sql`(${commits.additions} + ${commits.deletions})`), desc(commits.committed_at))
      .limit(3),
  ]);

  const dayMap = new Map<number, number>();
  for (const row of dailyCommitRows) {
    dayMap.set(row.dow, row.count);
  }

  const dayOrder = [1, 2, 3, 4, 5, 6, 0];
  const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const maxDaily = Math.max(...dayOrder.map((day) => dayMap.get(day) ?? 0), 1);

  const bars: WeeklyBar[] = dayOrder.map((day, index) => ({
    label: dayLabels[index],
    value: Math.round(((dayMap.get(day) ?? 0) / maxDaily) * 100),
  }));

  const activeDays = dayOrder.filter((day) => (dayMap.get(day) ?? 0) > 0).length;
  const consistencyScore = Math.round((activeDays / 7) * 100);

  const totalBytes = languageRows.reduce((sum, row) => sum + row.bytes, 0);
  const techStackPulse: TechStackEntry[] = languageRows.map((row) => ({
    label: row.language,
    percentage: totalBytes > 0 ? Math.round((row.bytes / totalBytes) * 1000) / 10 : 0,
  }));

  const topContributions: TopContribution[] = contributionRows.map((row) => {
    const [repoOrg = 'unknown', repoName = row.fullName] = row.fullName.split('/');
    const normalizedTitle = (row.title ?? '').split('\n')[0].trim();

    return {
      title: normalizedTitle || 'chore: maintenance update',
      repo: repoName,
      repoOrg,
      impact: row.impact,
    };
  });

  res.json({
    weekStart: weekStart.toISOString().slice(0, 10),
    weekEnd: weekEnd.toISOString().slice(0, 10),
    consistencyScore,
    consistencyBars: bars,
    techStackPulse,
    topContributions,
  });
});

export default summaryRouter;

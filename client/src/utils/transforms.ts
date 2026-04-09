import type { CommitHistoryResponse, CommitsByDayResponse, CommitsByHourResponse } from '@commitly/schemas';

export type CommitHistoryCell = { date: string; count: number; intensity: number };
export type CommitHistoryData = CommitHistoryCell[];

export function transformCommitsByHour(response: CommitsByHourResponse): CommitsByHourResponse {
  const hourCounts = response.commitByHour;
  const blocks = [
    { label: 'Morning', range: [6, 12] },
    { label: 'Afternoon', range: [12, 17] },
    { label: 'Evening', range: [17, 22] },
    { label: 'Night', range: [22, 6] },
  ];

  const blockCounts: Record<string, number> = {};
  for (const block of blocks) {
    let count = 0;
    if (block.range[0] < block.range[1]) {
      for (let h = block.range[0]; h < block.range[1]; h++) count += hourCounts[h] ?? 0;
    } else {
      for (let h = block.range[0]; h < 24; h++) count += hourCounts[h] ?? 0;
      for (let h = 0; h < block.range[1]; h++) count += hourCounts[h] ?? 0;
    }
    blockCounts[block.label] = count;
  }

  const max = Math.max(...Object.values(blockCounts), 1);
  return {
    commitByHour: Object.fromEntries(blocks.map((b) => [b.label, Math.round((blockCounts[b.label] / max) * 100)])),
  };
}

export function transformCommitsByDay(response: CommitsByDayResponse): CommitsByDayResponse {
  const max = Math.max(...Object.values(response.commitByDay), 1);
  return {
    commitByDay: Object.fromEntries(Object.entries(response.commitByDay).map(([day, count]) => [day, count / max])),
  };
}

export function transformCommitHistory(response: CommitHistoryResponse): CommitHistoryData {
  const days = 52 * 7;
  const today = new Date();
  const entries: { date: string; count: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    entries.push({ date: key, count: response.commitHistory[key] ?? 0 });
  }

  const max = Math.max(...entries.map((e) => e.count), 1);
  return entries.map((e) => ({ ...e, intensity: e.count / max }));
}

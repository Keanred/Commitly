import { z } from "zod"

const countRecordSchema = z.record(z.string(), z.number().int().nonnegative())

export const commitStreakResponseSchema = z.object({
  currentStreak: z.number().int().nonnegative(),
  longestStreak: z.number().int().nonnegative(),
})

export const commitsByHourResponseSchema = z.object({
  commitByHour: countRecordSchema,
})

export const commitsByDayResponseSchema = z.object({
  commitByDay: countRecordSchema,
})

export const commitHistoryResponseSchema = z.object({
  commitHistory: z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.number().int().nonnegative()),
})

export const weeklyDeltaResponseSchema = z.object({
  thisWeek: z.number().int().nonnegative(),
  lastWeek: z.number().int().nonnegative(),
  delta: z.number().int(),
})

export const activeRepoStatusSchema = z.enum(["healthy", "maintenance", "failing"])

export const activeRepoSchema = z.object({
  name: z.string(),
  description: z.string(),
  language: z.string().nullable(),
  branch: z.string(),
  status: activeRepoStatusSchema,
  lastActivity: z.string(),
})

export const activeReposResponseSchema = z.array(activeRepoSchema)

export const repoLanguagesResponseSchema = z.object({
  bytes: z.record(z.string(), z.number().nonnegative()),
  percentages: z.record(z.string(), z.number().nonnegative()),
})

export const staleBranchEntrySchema = z.object({
  branch: z.string(),
  lastCommitDate: z.string().datetime().nullable(),
})

export const staleBranchesResponseSchema = z.record(z.string(), z.array(staleBranchEntrySchema))

export const globalIntegrityResponseSchema = z.object({
  score: z.number().int().min(0).max(100),
  breakdown: z.object({
    activity: z.number().int().min(0).max(100),
    branchHygiene: z.number().int().min(0).max(100),
    quality: z.number().int().min(0).max(100),
    hygiene: z.number().int().min(0).max(100),
  }),
  counts: z.object({
    totalRepos: z.number().int().nonnegative(),
    healthyRepos: z.number().int().nonnegative(),
    maintenanceRepos: z.number().int().nonnegative(),
    failingRepos: z.number().int().nonnegative(),
    staleBranches: z.number().int().nonnegative(),
    reposMissingReadme: z.number().int().nonnegative(),
  }),
  summary: z.string(),
})

export const dashboardMetricsResponseSchema = z.object({
  streak: commitStreakResponseSchema,
  commitByHour: commitsByHourResponseSchema,
  commitByDay: commitsByDayResponseSchema,
  weeklyCommitData: weeklyDeltaResponseSchema,
  weeklyPRData: weeklyDeltaResponseSchema,
  weeklyQualityData: weeklyDeltaResponseSchema,
  commitHistory: commitHistoryResponseSchema,
  activeRepos: activeReposResponseSchema,
})

export const fetchCommitsResponseSchema = z.object({
  totalCommits: z.number().int().nonnegative(),
})

export const fetchLanguagesResponseSchema = z.object({
  totalLanguages: z.number().int().nonnegative(),
})

export const fetchBranchesResponseSchema = z.object({
  totalBranches: z.number().int().nonnegative(),
})

export type CommitStreakResponse = z.infer<typeof commitStreakResponseSchema>
export type CommitsByHourResponse = z.infer<typeof commitsByHourResponseSchema>
export type CommitsByDayResponse = z.infer<typeof commitsByDayResponseSchema>
export type CommitHistoryResponse = z.infer<typeof commitHistoryResponseSchema>
export type WeeklyDeltaResponse = z.infer<typeof weeklyDeltaResponseSchema>
export type ActiveRepoStatus = z.infer<typeof activeRepoStatusSchema>
export type ActiveRepo = z.infer<typeof activeRepoSchema>
export type ActiveReposResponse = z.infer<typeof activeReposResponseSchema>
export type RepoLanguagesResponse = z.infer<typeof repoLanguagesResponseSchema>
export type StaleBranchEntry = z.infer<typeof staleBranchEntrySchema>
export type StaleBranchesResponse = z.infer<typeof staleBranchesResponseSchema>
export type GlobalIntegrityResponse = z.infer<typeof globalIntegrityResponseSchema>
export type DashboardMetricsResponse = z.infer<typeof dashboardMetricsResponseSchema>
export type FetchCommitsResponse = z.infer<typeof fetchCommitsResponseSchema>
export type FetchLanguagesResponse = z.infer<typeof fetchLanguagesResponseSchema>
export type FetchBranchesResponse = z.infer<typeof fetchBranchesResponseSchema>

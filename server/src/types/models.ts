export interface User {
  id: number;
  github_id: number;
  login: string;
  name: string | null;
  avatar_url: string | null;
  access_token: string;
  last_synced_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Repo {
  id: number;
  user_id: number;
  github_id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  open_issues: number;
  has_readme: boolean;
  default_branch: string | null;
  pushed_at: Date | null;
  repo_created_at: Date | null;
  repo_updated_at: Date | null;
  fetched_at: Date;
}

export interface Commit {
  id: number;
  user_id: number;
  repo_id: number;
  sha: string;
  message: string | null;
  additions: number;
  deletions: number;
  committed_at: Date;
  fetched_at: Date;
}

export interface Branch {
  id: number;
  repo_id: number;
  name: string;
  last_commit_sha: string | null;
  last_commit_date: Date | null;
  is_default: boolean;
  fetched_at: Date;
}

export interface Language {
  id: number;
  repo_id: number;
  language: string;
  bytes: number;
  fetched_at: Date;
}

export interface WeeklySummary {
  id: number;
  user_id: number;
  week_start: Date;
  week_end: Date;
  summary_text: string;
  generated_at: Date;
}

// Insert types — omit auto-generated fields

export type UserInsert = Omit<User, 'id' | 'last_synced_at' | 'created_at' | 'updated_at'>;

export type RepoInsert = Omit<Repo, 'id' | 'fetched_at'>;

export type CommitInsert = Omit<Commit, 'id' | 'fetched_at'>;

export type BranchInsert = Omit<Branch, 'id' | 'fetched_at'>;

export type LanguageInsert = Omit<Language, 'id' | 'fetched_at'>;

export type WeeklySummaryInsert = Omit<WeeklySummary, 'id' | 'generated_at'>;

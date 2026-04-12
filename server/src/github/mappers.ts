import type { CommitInsert, PullRequestInsert, RepoInsert } from '../types/models';
import type { GitHubCommit, GitHubPullRequest, GitHubRepo } from './client';

export function mapGitHubRepo(userId: number, repo: GitHubRepo, hasReadme: boolean): RepoInsert {
  return {
    user_id: userId,
    github_id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    open_issues: repo.open_issues_count,
    has_readme: hasReadme,
    default_branch: repo.default_branch,
    pushed_at: repo.pushed_at ? new Date(repo.pushed_at) : null,
    repo_created_at: repo.created_at ? new Date(repo.created_at) : null,
    repo_updated_at: repo.updated_at ? new Date(repo.updated_at) : null,
  };
}

// eslint-disable-next-line complexity
export function mapGitHubCommit(userId: number, repoId: number, commit: GitHubCommit): CommitInsert {
  return {
    user_id: userId,
    repo_id: repoId,
    sha: commit.sha,
    message: commit.commit?.message ?? '',
    additions: commit.stats?.additions ?? 0,
    deletions: commit.stats?.deletions ?? 0,
    committed_at: commit.commit?.author?.date ? new Date(commit.commit.author.date) : new Date(),
  };
}

export function mapGitHubPullRequest(userId: number, repoId: number, pr: GitHubPullRequest): PullRequestInsert {
  return {
    user_id: userId,
    repo_id: repoId,
    github_id: pr.id,
    number: pr.number,
    title: pr.title ?? '',
    state: pr.state,
    merged: !!pr.merged_at,
    merged_at: pr.merged_at ? new Date(pr.merged_at) : null,
    created_at: pr.created_at ? new Date(pr.created_at) : new Date(),
    closed_at: pr.closed_at ? new Date(pr.closed_at) : null,
  };
}

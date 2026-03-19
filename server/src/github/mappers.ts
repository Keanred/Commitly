import type { RepoInsert, CommitInsert } from '../types/models';

export function mapGitHubRepo(userId: number, repo: any): RepoInsert {
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
    has_readme: false,
    default_branch: repo.default_branch,
    pushed_at: repo.pushed_at ? new Date(repo.pushed_at) : null,
    repo_created_at: repo.created_at ? new Date(repo.created_at) : null,
    repo_updated_at: repo.updated_at ? new Date(repo.updated_at) : null,
  };
}

export function mapGitHubCommit(userId: number, repoId: number, commit: any): CommitInsert {
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

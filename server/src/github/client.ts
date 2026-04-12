/**
 * GitHub API client for authenticated requests, pagination, and rate limit handling.
 */

const BASE_URL = 'https://api.github.com';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string | null;
  pushed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface GitHubCommit {
  sha: string;
  stats?: {
    additions?: number;
    deletions?: number;
  };
  commit?: {
    message?: string;
    author?: {
      date?: string;
    };
    committer?: {
      date?: string;
    };
  };
}

export interface GitHubBranch {
  name: string;
  commit?: {
    sha?: string;
  };
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title?: string | null;
  state: string;
  merged_at?: string | null;
  created_at?: string | null;
  closed_at?: string | null;
}

export type GitHubLanguages = Record<string, number>;

export interface GitHubClientOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number>;
}

/**
 * Make an authenticated request to the GitHub API.
 * @param token GitHub OAuth access token
 * @param endpoint API endpoint (e.g. '/user/repos')
 * @param options Optional fetch options (method, headers, body, params)
 * @returns Parsed JSON response
 * @throws Error if request fails or rate limited
 */
// eslint-disable-next-line complexity
export async function fetchGitHub<T = unknown>(
  token: string,
  endpoint: string,
  options: GitHubClientOptions = {},
): Promise<T> {
  const url = new URL(BASE_URL + endpoint);
  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  }

  const res = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
    const reset = res.headers.get('X-RateLimit-Reset');
    const resetDate = reset ? new Date(Number(reset) * 1000) : null;
    throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate}`);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${res.statusText} - ${errText}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Fetch all paginated results from a GitHub API endpoint.
 * Reuses fetchGitHub for auth, headers, and rate limit handling.
 * @param token GitHub OAuth access token
 * @param endpoint API endpoint (e.g. '/user/repos')
 * @param options Optional fetch options (params, etc.)
 * @returns Array of all results across pages
 */
// eslint-disable-next-line complexity
export async function fetchGitHubPaginated<T = unknown>(
  token: string,
  endpoint: string,
  options: GitHubClientOptions = {},
): Promise<T[]> {
  let results: T[] = [];
  let url: URL | null = new URL(BASE_URL + endpoint);

  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => url?.searchParams.append(k, String(v)));
  }

  while (url) {
    const res: Response = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
      const reset = res.headers.get('X-RateLimit-Reset');
      const resetDate = reset ? new Date(Number(reset) * 1000) : null;
      throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate}`);
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GitHub API error: ${res.status} ${res.statusText} - ${errText}`);
    }

    const pageData: unknown = await res.json();
    if (Array.isArray(pageData)) {
      results = results.concat(pageData as T[]);
    } else {
      results.push(pageData as T);
    }

    const link: string | null = res.headers.get('link');
    if (link) {
      const match: RegExpMatchArray | null = link.match(/<([^>]+)>; rel="next"/);
      url = match ? new URL(match[1]) : null;
    } else {
      url = null;
    }
  }

  return results;
}

/**
 * Fetch all repositories for the authenticated user.
 */
export async function fetchUserRepos(token: string): Promise<GitHubRepo[]> {
  return fetchGitHubPaginated<GitHubRepo>(token, '/user/repos', { params: { per_page: 100 } });
}

/**
 * Fetch all commits for a given repo (optionally filtered by author).
 */
export async function fetchRepoCommits(
  token: string,
  owner: string,
  repo: string,
  author?: string,
  since?: string,
): Promise<GitHubCommit[]> {
  const params: Record<string, string | number> = { per_page: 100 };
  if (author) params.author = author;
  if (since) params.since = since;
  return fetchGitHubPaginated<GitHubCommit>(token, `/repos/${owner}/${repo}/commits`, { params });
}

/**
 * Fetch language breakdown for a given repo.
 */
export async function fetchRepoLanguages(token: string, owner: string, repo: string): Promise<GitHubLanguages> {
  return fetchGitHub<GitHubLanguages>(token, `/repos/${owner}/${repo}/languages`);
}

/**
 * Fetch all branches for a given repo.
 */
export async function fetchRepoBranches(token: string, owner: string, repo: string): Promise<GitHubBranch[]> {
  return fetchGitHubPaginated<GitHubBranch>(token, `/repos/${owner}/${repo}/branches`, { params: { per_page: 100 } });
}

/**
 * Fetch commit details by SHA for a repository.
 */
export async function fetchRepoCommitBySha(
  token: string,
  owner: string,
  repo: string,
  sha: string,
): Promise<GitHubCommit> {
  return fetchGitHub<GitHubCommit>(token, `/repos/${owner}/${repo}/commits/${sha}`);
}

/**
 * Determine whether a repository has a README.
 * Returns false on 404, rethrows other errors.
 */
export async function fetchRepoHasReadme(token: string, owner: string, repo: string): Promise<boolean> {
  try {
    await fetchGitHub(token, `/repos/${owner}/${repo}/readme`);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return false;
    }
    throw error;
  }
}

/**
 * Fetch pull requests for a given repo.
 */
export async function fetchRepoPullRequests(
  token: string,
  owner: string,
  repo: string,
  state: string = 'all',
  since?: string,
): Promise<GitHubPullRequest[]> {
  const params: Record<string, string | number> = { per_page: 100, state };
  if (since) params.since = since;
  return fetchGitHubPaginated<GitHubPullRequest>(token, `/repos/${owner}/${repo}/pulls`, { params });
}

/**
 * Fetch all repositories for the authenticated user.
 * @param token GitHub OAuth access token
 * @returns Array of repository objects
 */
export async function fetchUserRepos(token: string) {
  // per_page=100 is max allowed by GitHub
  return fetchGitHubPaginated(token, '/user/repos', { params: { per_page: 100 } });
}

/**
 * Fetch all commits for a given repo (optionally filtered by author).
 * @param token GitHub OAuth access token
 * @param owner Repository owner
 * @param repo Repository name
 * @param author (optional) GitHub login to filter commits
 * @returns Array of commit objects
 */
export async function fetchRepoCommits(token: string, owner: string, repo: string, author?: string) {
  const params: Record<string, string | number> = { per_page: 100 };
  if (author) params.author = author;
  return fetchGitHubPaginated(token, `/repos/${owner}/${repo}/commits`, { params });
}

/**
 * Fetch language breakdown for a given repo.
 * @param token GitHub OAuth access token
 * @param owner Repository owner
 * @param repo Repository name
 * @returns Object mapping language to bytes
 */
export async function fetchRepoLanguages(token: string, owner: string, repo: string) {
  return fetchGitHub(token, `/repos/${owner}/${repo}/languages`);
}

/**
 * Fetch all branches for a given repo.
 * @param token GitHub OAuth access token
 * @param owner Repository owner
 * @param repo Repository name
 * @returns Array of branch objects
 */
export async function fetchRepoBranches(token: string, owner: string, repo: string) {
  return fetchGitHubPaginated(token, `/repos/${owner}/${repo}/branches`, { params: { per_page: 100 } });
}
/**
 * GitHub API client for authenticated requests, pagination, and rate limit handling.
 */

const BASE_URL = 'https://api.github.com';

export interface GitHubClientOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
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
export async function fetchGitHub<T = any>(
  token: string,
  endpoint: string,
  options: GitHubClientOptions = {}
): Promise<T> {
  const url = new URL(BASE_URL + endpoint);
  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  }
  const res = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // Rate limit handling
  if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
    const reset = res.headers.get('X-RateLimit-Reset');
    const resetDate = reset ? new Date(Number(reset) * 1000) : null;
    throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate}`);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${res.statusText} - ${errText}`);
  }

  return res.json();
}

/**
 * Fetch all paginated results from a GitHub API endpoint.
 * Reuses fetchGitHub for auth, headers, and rate limit handling.
 * @param token GitHub OAuth access token
 * @param endpoint API endpoint (e.g. '/user/repos')
 * @param options Optional fetch options (params, etc.)
 * @returns Array of all results across pages
 */
export async function fetchGitHubPaginated<T = any>(
  token: string,
  endpoint: string,
  options: GitHubClientOptions = {}
): Promise<T[]> {
  let results: T[] = [];
  let url: URL | null = new URL(BASE_URL + endpoint);
  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => url!.searchParams.append(k, String(v)));
  }
  while (url) {
    const currentUrl = url.toString();
    const res: Response = await fetch(currentUrl, {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // Rate limit handling (same as fetchGitHub)
    if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
      const reset = res.headers.get('X-RateLimit-Reset');
      const resetDate = reset ? new Date(Number(reset) * 1000) : null;
      throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate}`);
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GitHub API error: ${res.status} ${res.statusText} - ${errText}`);
    }
    const pageData = await res.json();
    if (Array.isArray(pageData)) {
      results = results.concat(pageData);
    } else {
      results.push(pageData);
    }
    // Parse Link header for next page
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

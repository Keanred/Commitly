export interface User {
  id: number;
  github_id: number;
  login: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

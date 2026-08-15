export interface AuthUser {
  id: number;
  username: string;
  email: string;
  image?: string | null;
  role: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message?: string;
  user?: AuthUser;
  access_token?: string;
}

export const TOKEN_KEY = 'access_token';
export const USER_KEY = 'auth_user';
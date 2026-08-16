export interface User {
  id: number;
  username: string;
  email: string;
  image?: string | null;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

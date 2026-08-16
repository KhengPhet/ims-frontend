import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

export const TOKEN_KEY = 'access_token';
export const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private localStore(): Storage | null {
    try {
      return typeof window === 'undefined' ? null : window.localStorage;
    } catch {
      return null;
    }
  }

  private sessionStore(): Storage | null {
    try {
      return typeof window === 'undefined' ? null : window.sessionStorage;
    } catch {
      return null;
    }
  }

  setToken(token: string, rememberMe = true): void {
    this.removeToken();
    const store = rememberMe ? this.localStore() : this.sessionStore();
    store?.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return (
      this.localStore()?.getItem(TOKEN_KEY) ??
      this.sessionStore()?.getItem(TOKEN_KEY) ??
      null
    );
  }

  removeToken(): void {
    this.localStore()?.removeItem(TOKEN_KEY);
    this.sessionStore()?.removeItem(TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  setUser(user: User, rememberMe = true): void {
    this.removeUser();
    const store = rememberMe ? this.localStore() : this.sessionStore();
    store?.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const raw =
      this.localStore()?.getItem(USER_KEY) ??
      this.sessionStore()?.getItem(USER_KEY) ??
      null;

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  removeUser(): void {
    this.localStore()?.removeItem(USER_KEY);
    this.sessionStore()?.removeItem(USER_KEY);
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
  }
}

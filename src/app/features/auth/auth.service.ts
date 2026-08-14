import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    AuthResponse,
    AuthUser,
    RegisterResponse,
    TOKEN_KEY,
    USER_KEY,
} from '../../core/models/auth.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly apiUrl = `${environment.apiUrl}/auth`;

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
            .pipe(tap((response) => this.setSession(response)));
    }

    register(formData: FormData): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, formData);
    }

    getProfile(): Observable<AuthUser> {
        return this.http.get<AuthUser>(`${this.apiUrl}/profile`);
    }

    getToken(): string | null {
        if (typeof localStorage === 'undefined') {
            return null;
        }
        return localStorage.getItem(TOKEN_KEY);
    }

    getUser(): AuthUser | null {
        if (typeof localStorage === 'undefined') {
            return null;
        }
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw) as AuthUser;
        } catch {
            return null;
        }
    }

    getRole(): string | null {
        return this.getUser()?.role ?? null;
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }
        const expiresAt = this.getTokenExpiry(token);
        return expiresAt === null || expiresAt > Date.now();
    }

    private getTokenExpiry(token: string): number | null {
        try {
            const payloadPart = token.split('.')[1];
            if (!payloadPart) {
                return null;
            }
            const payload = JSON.parse(atob(payloadPart)) as { exp?: number };
            return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
        } catch {
            return null;
        }
    }

    setSession(response: AuthResponse): void {
        localStorage.setItem(TOKEN_KEY, response.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    clearSession(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    logout(): void {
        this.clearSession();
        this.router.navigate(['/login']);
    }
}

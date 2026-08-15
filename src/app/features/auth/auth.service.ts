import {
    Injectable,
    inject,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

import {
    Router,
} from '@angular/router';

import {
    Observable,
    tap,
} from 'rxjs';

import {
    environment,
} from '../../../environments/environment';
import { AuthResponse, AuthUser, RegisterResponse, TOKEN_KEY, USER_KEY } from '../../core/models/auth.model';


@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private readonly http = inject(HttpClient);

    private readonly router = inject(Router);

    private readonly apiUrl =
        `${environment.apiUrl}/auth`;


    // =========================
    // LOGIN
    // =========================

    login(
        email: string,
        password: string
    ): Observable<AuthResponse> {

        return this.http
            .post<AuthResponse>(
                `${this.apiUrl}/login`,
                {
                    email,
                    password,
                }
            )
            .pipe(
                tap((response) => {

                    this.setSession(response);

                })
            );
    }


    // =========================
    // REGISTER
    // =========================

    register(
        formData: FormData
    ): Observable<RegisterResponse> {

        // Do NOT set Content-Type manually.
        // Angular/browser sets multipart/form-data + boundary automatically.

        return this.http.post<RegisterResponse>(
            `${this.apiUrl}/register`,
            formData
        );
    }


    // =========================
    // PROFILE
    // =========================

    getProfile(): Observable<AuthUser> {

        return this.http.get<AuthUser>(
            `${this.apiUrl}/profile`
        );
    }


    // =========================
    // TOKEN
    // =========================

    getToken(): string | null {

        if (
            typeof window === 'undefined'
        ) {
            return null;
        }

        return localStorage.getItem(
            TOKEN_KEY
        );
    }


    // =========================
    // USER
    // =========================

    getUser(): AuthUser | null {

        if (
            typeof window === 'undefined'
        ) {
            return null;
        }

        const raw =
            localStorage.getItem(USER_KEY);

        if (!raw) {
            return null;
        }

        try {

            return JSON.parse(
                raw
            ) as AuthUser;

        } catch {

            return null;

        }
    }


    // =========================
    // ROLE
    // =========================

    getRole(): string | null {

        return this.getUser()?.role ?? null;

    }


    // =========================
    // AUTH CHECK
    // =========================

    isAuthenticated(): boolean {

        const token =
            this.getToken();

        if (!token) {
            return false;
        }

        const expiresAt =
            this.getTokenExpiry(token);

        if (expiresAt === null) {
            return true;
        }

        return expiresAt > Date.now();
    }


    // =========================
    // JWT EXPIRATION
    // =========================

    private getTokenExpiry(
        token: string
    ): number | null {

        try {

            const parts =
                token.split('.');

            if (parts.length !== 3) {
                return null;
            }

            const payload =
                JSON.parse(
                    atob(parts[1])
                ) as {
                    exp?: number;
                };

            if (
                typeof payload.exp !== 'number'
            ) {
                return null;
            }

            return payload.exp * 1000;

        } catch {

            return null;

        }
    }


    // =========================
    // SAVE SESSION
    // =========================

    setSession(
        response: AuthResponse
    ): void {

        if (
            typeof window === 'undefined'
        ) {
            return;
        }

        localStorage.setItem(
            TOKEN_KEY,
            response.access_token
        );

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(
                response.user
            )
        );
    }


    // =========================
    // CLEAR SESSION
    // =========================

    clearSession(): void {

        if (
            typeof window === 'undefined'
        ) {
            return;
        }

        localStorage.removeItem(
            TOKEN_KEY
        );

        localStorage.removeItem(
            USER_KEY
        );
    }


    // =========================
    // LOGOUT
    // =========================

    logout(): void {

        this.clearSession();

        this.router.navigate([
            '/login',
        ]);
    }
}
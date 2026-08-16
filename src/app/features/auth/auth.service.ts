import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, RegisterResponse, User } from '../../core/models/user.model';
import { TokenService } from '../../core/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  login(email: string, password: string, rememberMe = false): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          this.tokenService.setToken(response.access_token, rememberMe);
          this.tokenService.setUser(response.user, rememberMe);
        }),
      );
  }

  register(formData: FormData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, formData);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  getCurrentUser(): User | null {
    return this.tokenService.getUser();
  }

  getUser(): User | null {
    return this.tokenService.getUser();
  }

  getRole(): string | null {
    return this.getCurrentUser()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return this.tokenService.hasToken();
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }

  logout(): void {
    this.tokenService.logout();
    void this.router.navigate(['/login']);
  }
}

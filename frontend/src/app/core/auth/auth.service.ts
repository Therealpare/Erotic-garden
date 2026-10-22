import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, map, shareReplay, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export type AdminRole = 'ADMIN' | 'EDITOR';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

const STORAGE_KEY = 'eg-admin-session';

/**
 * Admin session (spec §37). Tokens live in sessionStorage, so a session ends when the tab
 * closes and is never shared with other tabs or kept on a shared computer.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly session = signal<AuthResponse | null>(this.readSession());
  private refreshInFlight: Observable<string> | null = null;

  readonly user = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  get accessToken(): string | null {
    return this.session()?.accessToken ?? null;
  }

  login(email: string, password: string): Observable<AdminUser> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password }).pipe(
      tap((response) => this.store(response)),
      map((response) => response.user),
    );
  }

  /** Concurrent 401s share one refresh request instead of racing (each would revoke the other's token). */
  refreshAccessToken(): Observable<string> {
    const refreshToken = this.session()?.refreshToken;
    if (!refreshToken) throw new Error('No refresh token');

    this.refreshInFlight ??= this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, { refreshToken })
      .pipe(
        tap((response) => this.store(response)),
        map((response) => response.accessToken),
        finalize(() => (this.refreshInFlight = null)),
        shareReplay(1),
      );
    return this.refreshInFlight;
  }

  logout(): void {
    if (this.accessToken) {
      // Revoke the refresh token server-side; the local session ends regardless of the outcome.
      this.http.post(`${API_BASE_URL}/auth/logout`, {}).subscribe({ error: () => undefined });
    }
    this.clear();
    void this.router.navigate(['/admin/login']);
  }

  clear(): void {
    this.session.set(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable — nothing persisted.
    }
  }

  private store(response: AuthResponse): void {
    this.session.set(response);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(response));
    } catch {
      // Storage unavailable — the session still works until reload.
    }
  }

  private readSession(): AuthResponse | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthResponse) : null;
    } catch {
      return null;
    }
  }
}

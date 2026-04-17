import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  // Signal-based session state
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _userId = signal<number | null>(
    localStorage.getItem('user_id') ? Number(localStorage.getItem('user_id')) : null
  );
  private _username = signal<string | null>(localStorage.getItem('username'));

  // Public computed signals
  isLoggedIn = computed(() => !!this._token());
  currentUsername = computed(() => this._username());
  currentUserId = computed(() => this._userId());
  token = computed(() => this._token());

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login/`, { username, password })
      .pipe(tap(res => this.setSession(res)));
  }

  register(username: string, email: string, password: string, password2: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register/`, {
        username,
        email,
        password,
        password2,
      })
      .pipe(tap(res => this.setSession(res)));
  }

  logout() {
    this.http.post(`${this.apiUrl}/auth/logout/`, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user_id', String(res.user_id));
    localStorage.setItem('username', res.username);
    this._token.set(res.token);
    this._userId.set(res.user_id);
    this._username.set(res.username);
  }

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    this._token.set(null);
    this._userId.set(null);
    this._username.set(null);
    this.router.navigate(['/login']);
  }
}
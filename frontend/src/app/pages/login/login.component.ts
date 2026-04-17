import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">🎬</div>
        <h1>Welcome back</h1>
        <p class="subtitle">Sign in to Filmly</p>

        <div class="form-group">
          <label>Username</label>
          <input
            type="text"
            class="input"
            [(ngModel)]="username"
            placeholder="Your username"
            (keyup.enter)="submit()" />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            class="input"
            [(ngModel)]="password"
            placeholder="Your password"
            (keyup.enter)="submit()" />
        </div>

        @if (error) {
          <div class="error-msg">{{ error }}</div>
        }

        <button
          class="btn-submit"
          [disabled]="loading"
          (click)="submit()">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p class="switch-link">
          Don't have an account? <a routerLink="/register">Sign Up</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #0f0f0f;
    }
    .auth-card {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 14px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
    }
    .auth-logo {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 1rem;
    }
    h1 {
      text-align: center;
      font-size: 1.6rem;
      color: #fff;
      margin-bottom: 0.25rem;
    }
    .subtitle {
      text-align: center;
      color: #888;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    .form-group { margin-bottom: 1.1rem; }
    .form-group label {
      display: block;
      font-size: 0.85rem;
      color: #aaa;
      margin-bottom: 0.4rem;
    }
    .input {
      width: 100%;
      background: #111;
      border: 1px solid #333;
      border-radius: 8px;
      color: #fff;
      padding: 0.7rem 1rem;
      font-size: 0.95rem;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .input:focus { border-color: #e50914; }
    .error-msg {
      background: #3a1a1a;
      border: 1px solid #e50914;
      color: #ff6b6b;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }
    .btn-submit {
      width: 100%;
      padding: 0.75rem;
      background: #e50914;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
      margin-bottom: 1.2rem;
    }
    .btn-submit:hover:not(:disabled) { background: #c40812; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .switch-link {
      text-align: center;
      color: #888;
      font-size: 0.9rem;
    }
    .switch-link a { color: #e50914; text-decoration: none; }
    .switch-link a:hover { text-decoration: underline; }
  `],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  username = '';
  password = '';
  loading = false;
  error = '';

  submit() {
    this.error = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.toast.success('Welcome back!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || 'Invalid username or password.';
      },
    });
  }
}
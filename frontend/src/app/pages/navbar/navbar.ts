import { Component, inject, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()">
      <a routerLink="/home" class="brand">
        <span class="brand-icon">◈</span>
        <span class="brand-text">Filmly</span>
      </a>

      <div class="nav-links">
        <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Movies</a>

        @if (auth.isLoggedIn()) {
          <a routerLink="/favorites" routerLinkActive="active">Favorites</a>
          <a routerLink="/advisor" routerLinkActive="active">AI Advisor</a>
          <a routerLink="/actors" routerLinkActive="active">
            <span class="actors-link">🎭 My Actors</span>
          </a>
          <a routerLink="/profile" routerLinkActive="active" class="profile-link">
            <span class="avatar-dot">{{ auth.currentUsername()![0].toUpperCase() }}</span>
            {{ auth.currentUsername() }}
          </a>
          <button class="btn-logout" (click)="logout()">Sign out</button>
        } @else {
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/register" class="btn-register">Sign Up</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2.5rem;
      height: 68px;
      position: sticky;
      top: 0;
      z-index: 100;
      background: transparent;
      transition: background 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease;
    }
    .navbar.scrolled {
      background: rgba(8, 8, 8, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      box-shadow: 0 1px 0 rgba(255,255,255,0.05);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }
    .brand-icon {
      font-size: 1.3rem;
      color: #e50914;
      display: inline-block;
      animation: spin 12s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .brand-text {
      font-family: 'DM Serif Display', serif;
      font-size: 1.5rem;
      color: #fff;
      letter-spacing: -0.5px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.75rem;
    }
    .nav-links a {
      color: #aaa;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s;
      position: relative;
    }
    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 1.5px;
      background: #e50914;
      transition: width 0.25s ease;
    }
    .nav-links a:hover { color: #fff; }
    .nav-links a:hover::after { width: 100%; }
    .nav-links a.active { color: #fff; }
    .nav-links a.active::after { width: 100%; }
    .actors-link { display: flex; align-items: center; gap: 4px; }
    .profile-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .avatar-dot {
      width: 26px;
      height: 26px;
      background: #e50914;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid #333;
      color: #888;
      padding: 0.4rem 0.9rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-logout:hover { border-color: #e50914; color: #e50914; }
    .btn-register {
      background: #e50914;
      color: #fff !important;
      padding: 0.45rem 1.1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.88rem;
      transition: all 0.2s;
    }
    .btn-register:hover {
      background: #ff1a24 !important;
      box-shadow: 0 4px 20px rgba(229, 9, 20, 0.4);
    }
    .btn-register::after { display: none !important; }
  `],
})
export class NavbarComponent {
  auth = inject(AuthService);
  isScrolled = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  logout() { this.auth.logout(); }
}
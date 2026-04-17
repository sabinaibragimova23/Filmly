import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-inner">

        <div class="footer-top">
          <div class="brand">
            <span class="brand-icon">◈</span>
            <span class="brand-text">Filmly</span>
          </div>
          <p class="tagline">Discover, review, and remember the films that matter to you.</p>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4>Browse</h4>
            <a routerLink="/home">All Movies</a>
            <a routerLink="/home">Action</a>
            <a routerLink="/home">Drama</a>
            <a routerLink="/home">Sci-Fi</a>
          </div>
          <div class="link-group">
            <h4>Account</h4>
            <a routerLink="/login">Sign In</a>
            <a routerLink="/register">Sign Up</a>
            <a routerLink="/favorites">Favorites</a>
            <a routerLink="/profile">Profile</a>
          </div>
          <div class="link-group">
            <h4>About</h4>
            <span>Movie reviews platform</span>
            <span>Built with Angular</span>
            <span>Django REST API</span>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copy">© 2026 Filmly. All rights reserved.</p>
          <p class="disclaimer">Movie posters provided for educational purposes only.</p>
        </div>

      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #080808;
      border-top: 1px solid #161616;
      margin-top: 4rem;
    }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2.5rem 2rem;
    }
    .footer-top {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
      padding-bottom: 2.5rem;
      border-bottom: 1px solid #161616;
      flex-wrap: wrap;
    }
    .brand { display: flex; align-items: center; gap: 0.5rem; }
    .brand-icon { font-size: 1.2rem; color: #e50914; }
    .brand-text { font-family: 'DM Serif Display', serif; font-size: 1.4rem; color: #fff; }
    .tagline { color: #444; font-size: 0.88rem; max-width: 340px; }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 2rem;
      margin-bottom: 2.5rem;
    }
    .link-group h4 {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #555;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .link-group a, .link-group span {
      display: block;
      color: #555;
      font-size: 0.88rem;
      margin-bottom: 0.55rem;
      transition: color 0.2s;
    }
    .link-group a:hover { color: #fff; }

    .footer-bottom {
      padding-top: 1.5rem;
      border-top: 1px solid #161616;
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
    }
    .copy { font-size: 0.8rem; color: #444; }
    .disclaimer { font-size: 0.75rem; color: #2e2e2e; }
  `],
})
export class FooterComponent {}
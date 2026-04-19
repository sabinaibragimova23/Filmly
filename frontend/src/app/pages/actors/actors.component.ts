import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface ActorRating {
  id: number;
  name: string;
  photo_url: string | null;
  match_percent: number;
  movies_count: number;
  top_genre: string;
  movies: string[];
}

@Component({
  selector: 'app-actors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="header-icon">🎭</div>
        <div>
          <h1>Your Actor Matches</h1>
          <p>Based on your reviews and favorites</p>
        </div>
      </div>

      @if (loading) {
        <div class="skeleton-grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="skeleton-card">
              <div class="skeleton-avatar"></div>
              <div class="skeleton-line wide"></div>
              <div class="skeleton-line narrow"></div>
              <div class="skeleton-bar"></div>
            </div>
          }
        </div>
      } @else if (error) {
        <div class="error-banner">⚠️ {{ error }}</div>
      } @else if (actors.length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🎬</div>
          <h2>No data yet</h2>
          <p>Rate some movies or add them to favorites — we'll show you which actors suit your taste.</p>
        </div>
      } @else {
        <div class="top-three" *ngIf="actors.length >= 3">
          <div class="podium-label">🏆 Your Top 3 Actors</div>
          <div class="podium">
            @for (actor of actors.slice(0, 3); track actor.id; let i = $index) {
              <div class="podium-card" [class.gold]="i === 0" [class.silver]="i === 1" [class.bronze]="i === 2">
                <div class="podium-rank">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉' }}</div>
                <div class="podium-avatar">
                  @if (actor.photo_url) {
                    <img [src]="actor.photo_url" [alt]="actor.name" (error)="onImgError($event)" />
                  } @else {
                    <span>{{ actor.name[0] }}</span>
                  }
                </div>
                <div class="podium-name">{{ actor.name }}</div>
                <div class="podium-percent">{{ actor.match_percent }}%</div>
              </div>
            }
          </div>
        </div>

        <div class="section-title">All actors you've encountered</div>
        <div class="actors-grid">
          @for (actor of actors; track actor.id; let i = $index) {
            <div class="actor-card" [class.top]="i < 3">
              <div class="actor-avatar">
                @if (actor.photo_url) {
                  <img [src]="actor.photo_url" [alt]="actor.name" (error)="onImgError($event)" />
                } @else {
                  <span class="avatar-fallback">{{ actor.name[0] }}</span>
                }
                @if (i < 3) {
                  <div class="top-badge">TOP {{ i + 1 }}</div>
                }
              </div>

              <div class="actor-info">
                <div class="actor-name">{{ actor.name }}</div>
                <div class="actor-meta">
                  <span class="genre-tag">{{ actor.top_genre }}</span>
                  <span class="movies-count">{{ actor.movies_count }} {{ actor.movies_count === 1 ? 'film' : 'films' }}</span>
                </div>

                <div class="match-row">
                  <div class="match-bar-bg">
                    <div
                      class="match-bar-fill"
                      [style.width.%]="actor.match_percent"
                      [class.high]="actor.match_percent >= 80"
                      [class.mid]="actor.match_percent >= 50 && actor.match_percent < 80"
                      [class.low]="actor.match_percent < 50"
                    ></div>
                  </div>
                  <span class="match-label" [class.high]="actor.match_percent >= 80">
                    {{ actor.match_percent }}% match
                  </span>
                </div>

                @if (actor.movies.length > 0) {
                  <div class="actor-movies">
                    @for (m of actor.movies; track m) {
                      <span class="movie-chip">{{ m }}</span>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }

    .page-header {
      display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem;
    }
    .header-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: linear-gradient(135deg, #e50914, #8b0000);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; flex-shrink: 0;
    }
    h1 { font-size: 1.5rem; color: #fff; margin: 0 0 4px; font-weight: 700; }
    p { color: #888; font-size: 0.9rem; margin: 0; }

    /* Podium */
    .top-three { margin-bottom: 2.5rem; }
    .podium-label { color: #aaa; font-size: 0.85rem; text-transform: uppercase;
      letter-spacing: 0.1em; margin-bottom: 1rem; }
    .podium {
      display: flex; gap: 12px; justify-content: center;
    }
    .podium-card {
      flex: 1; max-width: 200px;
      background: #1a1a1a; border: 1px solid #2a2a2a;
      border-radius: 16px; padding: 1.5rem 1rem;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      transition: transform 0.2s;
    }
    .podium-card:hover { transform: translateY(-4px); }
    .podium-card.gold { border-color: #b8860b; background: #1f1a0f; }
    .podium-card.silver { border-color: #707070; background: #181818; }
    .podium-card.bronze { border-color: #7a4e2d; background: #1a1410; }
    .podium-rank { font-size: 1.8rem; }
    .podium-avatar {
      width: 64px; height: 64px; border-radius: 50%; overflow: hidden;
      background: #333; display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; font-weight: 700; color: #fff;
    }
    .podium-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .podium-name { color: #fff; font-weight: 600; font-size: 0.9rem; text-align: center; }
    .podium-percent { color: #e50914; font-weight: 700; font-size: 1.1rem; }

    /* Grid */
    .section-title { color: #888; font-size: 0.85rem; text-transform: uppercase;
      letter-spacing: 0.1em; margin-bottom: 1rem; }
    .actors-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 12px;
    }
    .actor-card {
      background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px;
      padding: 1rem 1.2rem; display: flex; gap: 1rem; align-items: flex-start;
      transition: border-color 0.2s;
    }
    .actor-card:hover { border-color: #444; }
    .actor-card.top { border-color: #3a1a1a; }

    .actor-avatar {
      position: relative; width: 56px; height: 56px; border-radius: 50%;
      overflow: hidden; flex-shrink: 0;
      background: #2a2a2a; display: flex; align-items: center; justify-content: center;
    }
    .actor-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-fallback { font-size: 1.3rem; font-weight: 700; color: #fff; }
    .top-badge {
      position: absolute; bottom: -2px; right: -2px;
      background: #e50914; color: #fff; font-size: 8px; font-weight: 800;
      padding: 2px 4px; border-radius: 4px; letter-spacing: 0.05em;
    }

    .actor-info { flex: 1; min-width: 0; }
    .actor-name { color: #fff; font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; }
    .actor-meta { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
    .genre-tag {
      background: #252525; border: 1px solid #333; color: #aaa;
      font-size: 0.75rem; padding: 2px 8px; border-radius: 20px;
    }
    .movies-count { color: #666; font-size: 0.78rem; }

    .match-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .match-bar-bg {
      flex: 1; height: 6px; background: #252525; border-radius: 3px; overflow: hidden;
    }
    .match-bar-fill {
      height: 100%; border-radius: 3px;
      transition: width 0.6s ease;
    }
    .match-bar-fill.high { background: linear-gradient(90deg, #e50914, #ff4d4d); }
    .match-bar-fill.mid  { background: linear-gradient(90deg, #e5820914, #e58c09); }
    .match-bar-fill.low  { background: #444; }
    .match-label { font-size: 0.8rem; color: #888; white-space: nowrap; font-weight: 600; }
    .match-label.high { color: #e50914; }

    .actor-movies { display: flex; flex-wrap: wrap; gap: 4px; }
    .movie-chip {
      font-size: 0.72rem; color: #777; background: #1f1f1f;
      border: 1px solid #2a2a2a; padding: 2px 8px; border-radius: 4px;
    }

    /* Skeleton */
    .skeleton-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 12px;
    }
    .skeleton-card {
      background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px;
      padding: 1.2rem; display: flex; flex-direction: column; gap: 10px;
      animation: pulse 1.5s ease-in-out infinite;
    }
    .skeleton-avatar { width: 56px; height: 56px; border-radius: 50%; background: #2a2a2a; }
    .skeleton-line { height: 12px; border-radius: 6px; background: #2a2a2a; }
    .skeleton-line.wide { width: 70%; }
    .skeleton-line.narrow { width: 40%; }
    .skeleton-bar { height: 6px; border-radius: 3px; background: #2a2a2a; }
    @keyframes pulse {
      0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
    }

    /* Empty / Error */
    .empty-state {
      text-align: center; padding: 4rem 2rem;
      background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-state h2 { color: #fff; margin-bottom: 0.5rem; }
    .empty-state p { color: #888; font-size: 0.9rem; }
    .error-banner {
      background: #3a1a1a; border: 1px solid #e50914;
      color: #ff6b6b; padding: 1rem 1.5rem; border-radius: 8px;
    }

    @media (max-width: 600px) {
      .actors-grid { grid-template-columns: 1fr; }
      .podium { gap: 8px; }
      .podium-card { padding: 1rem 0.5rem; }
    }
  `],
})
export class ActorsComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  actors: ActorRating[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    const token = this.auth.token();
    this.http.get<ActorRating[]>('http://localhost:8000/api/actors/my-ratings/', {
      headers: { Authorization: `Token ${token}` }
    }).subscribe({
      next: data => {
        this.actors = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load actor ratings.';
        this.loading = false;
      }
    });
  }

  onImgError(event: Event) {
    const el = event.target as HTMLImageElement;
    el.style.display = 'none';
  }
}
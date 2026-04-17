import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, StarRatingComponent],
  template: `
    <div class="card">
      <a [routerLink]="['/movie', movie.id]" class="poster-link">
        @if (movie.poster_url) {
          <img [src]="movie.poster_url" [alt]="movie.title" class="poster" loading="lazy" />
        } @else {
          <div class="poster-placeholder">🎬</div>
        }
        <div class="overlay">
          <span class="overlay-btn">View Details</span>
        </div>
      </a>

      <div class="card-body">
        <div class="card-meta">
          <span class="genre">{{ movie.genre }}</span>
          <span class="year">{{ movie.year }}</span>
        </div>
        <h3 class="title">
          <a [routerLink]="['/movie', movie.id]">{{ movie.title }}</a>
        </h3>
        <div class="card-footer">
          <app-star-rating [value]="movie.average_rating" [showValue]="true"></app-star-rating>
          @if (showFavoriteBtn) {
            <button
              class="fav-btn"
              [class.active]="isFavorited"
              (click)="onFavoriteClick($event)"
              [title]="isFavorited ? 'Remove from favorites' : 'Add to favorites'">
              {{ isFavorited ? '♥' : '♡' }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: #1a1a1a;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #242424;
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  border-color 0.3s ease;
      will-change: transform;
    }
    .card:hover {
      transform: translateY(-6px) scale(1.01);
      box-shadow: 0 20px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(229,9,20,0.15);
      border-color: #333;
    }
    .poster-link {
      position: relative;
      display: block;
      aspect-ratio: 2/3;
      overflow: hidden;
      background: #111;
    }
    .poster {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .card:hover .poster { transform: scale(1.06); }
    .poster-placeholder {
      width: 100%;
      height: 100%;
      background: #1e1e1e;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 1.2rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .card:hover .overlay { opacity: 1; }
    .overlay-btn {
      color: #fff;
      font-weight: 600;
      font-size: 0.85rem;
      border: 1.5px solid rgba(255,255,255,0.8);
      padding: 0.4rem 1rem;
      border-radius: 20px;
      backdrop-filter: blur(4px);
      background: rgba(255,255,255,0.1);
      transform: translateY(8px);
      transition: transform 0.3s ease;
    }
    .card:hover .overlay-btn { transform: translateY(0); }
    .card-body { padding: 0.85rem 1rem 1rem; }
    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
    }
    .genre {
      font-size: 0.7rem;
      color: #e50914;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.8px;
    }
    .year { font-size: 0.75rem; color: #666; }
    .title {
      font-size: 0.92rem;
      font-weight: 600;
      margin: 0 0 0.65rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
    }
    .title a {
      color: #f0f0f0;
      text-decoration: none;
      transition: color 0.2s;
    }
    .title a:hover { color: #e50914; }
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .fav-btn {
      background: transparent;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #555;
      transition: color 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      padding: 0;
      line-height: 1;
    }
    .fav-btn:hover { transform: scale(1.3); color: #e50914; }
    .fav-btn.active { color: #e50914; }
    .fav-btn.active:hover { transform: scale(1.2); }
  `],
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() isFavorited = false;
  @Input() showFavoriteBtn = false;
  @Output() favoriteToggle = new EventEmitter<Movie>();

  onFavoriteClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggle.emit(this.movie);
  }
}
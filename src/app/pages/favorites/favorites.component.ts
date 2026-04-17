import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Favorite } from '../../models';
import { FavoriteService } from '../../services/favorite.service';
import { ToastService } from '../../services/toast.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, MovieCardComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>My Favorites</h1>
        <p>Movies you've saved.</p>
      </div>

      @if (error) {
        <div class="error-banner">⚠️ {{ error }}</div>
      }

      @if (loading) {
        <div class="loading">Loading...</div>
      } @else if (favorites.length === 0) {
        <div class="empty-state">
          <p>You haven't added any favorites yet.</p>
          <a routerLink="/home" class="btn-browse">Browse Movies</a>
        </div>
      } @else {
        <div class="movies-grid">
          @for (fav of favorites; track fav.id) {
            <app-movie-card
              [movie]="fav.movie_details"
              [isFavorited]="true"
              [showFavoriteBtn]="true"
              (favoriteToggle)="removeFavorite(fav)">
            </app-movie-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 0.25rem; }
    .page-header p { color: #888; }
    .loading { text-align: center; padding: 3rem; color: #666; }
    .error-banner {
      background: #3a1a1a;
      border: 1px solid #e50914;
      color: #ff6b6b;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .empty-state { text-align: center; padding: 4rem 1rem; color: #888; }
    .empty-state p { margin-bottom: 1.5rem; }
    .btn-browse {
      padding: 0.65rem 1.6rem;
      background: #e50914;
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.25rem;
    }
  `],
})
export class FavoritesComponent implements OnInit {
  private favoriteService = inject(FavoriteService);
  private toast = inject(ToastService);

  favorites: Favorite[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.favoriteService.getFavorites().subscribe({
      next: favs => { this.favorites = favs; this.loading = false; },
      error: () => { this.error = 'Failed to load favorites.'; this.loading = false; },
    });
  }

  removeFavorite(fav: Favorite) {
    this.favoriteService.removeFavorite(fav.movie).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== fav.id);
        this.toast.success(`Removed "${fav.movie_details.title}" from favorites.`);
      },
      error: () => this.toast.error('Failed to remove.'),
    });
  }
}
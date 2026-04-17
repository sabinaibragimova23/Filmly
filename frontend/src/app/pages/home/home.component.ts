import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Movie, Favorite } from '../../models';
import { MovieService } from '../../services/movie.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, MovieCardComponent],
  template: `
    <div class="home-page">

      <!-- Hero -->
      <div class="hero">
        <h1>Discover & Review Movies</h1>
        <p>Find films you love. Share what you think.</p>
      </div>

      <!-- Filters -->
      <div class="filters">
        <input
          class="search-input"
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearchChange($event)"
          placeholder="Search movies..."
          type="text" />

        <select class="filter-select" [(ngModel)]="selectedGenre" (ngModelChange)="applyFilters()">
          <option value="">All Genres</option>
          @for (genre of genres; track genre) {
            <option [value]="genre">{{ genre }}</option>
          }
        </select>

        <select class="filter-select" [(ngModel)]="selectedYear" (ngModelChange)="applyFilters()">
          <option value="">All Years</option>
          @for (year of years; track year) {
            <option [value]="year">{{ year }}</option>
          }
        </select>

        <button class="btn-clear" (click)="clearFilters()">Clear</button>
      </div>

      <!-- Error state -->
      @if (error) {
        <div class="error-banner">⚠️ {{ error }}</div>
      }

      <!-- Loading state -->
      @if (loading) {
        <div class="loading">Loading movies...</div>
      }

      <!-- Movies grid -->
      @if (!loading && !error) {
        @if (paginatedMovies.length > 0) {
          <div class="movies-grid">
            @for (movie of paginatedMovies; track movie.id) {
              <app-movie-card
                [movie]="movie"
                [isFavorited]="isFavorited(movie.id)"
                [showFavoriteBtn]="auth.isLoggedIn()"
                (favoriteToggle)="toggleFavorite($event)">
              </app-movie-card>
            }
          </div>

          <!-- Pagination -->
          @if (totalPages > 1) {
            <div class="pagination">
              <button
                class="page-btn"
                [disabled]="currentPage === 1"
                (click)="changePage(currentPage - 1)">
                ‹ Prev
              </button>

              @for (page of pageNumbers; track page) {
                <button
                  class="page-btn"
                  [class.active]="page === currentPage"
                  (click)="changePage(page)">
                  {{ page }}
                </button>
              }

              <button
                class="page-btn"
                [disabled]="currentPage === totalPages"
                (click)="changePage(currentPage + 1)">
                Next ›
              </button>
            </div>
          }
        } @else {
          <div class="empty-state">
            <p>No movies found. Try a different search.</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .home-page { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem 3rem; }

    .hero {
      text-align: center;
      padding: 3.5rem 1rem 2.5rem;
    }
    .hero h1 {
      font-size: 2.2rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 0.5rem;
    }
    .hero p { color: #888; font-size: 1.1rem; }

    .filters {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .search-input {
      flex: 1;
      min-width: 200px;
      padding: 0.65rem 1rem;
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 8px;
      color: #fff;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-input:focus { border-color: #e50914; }
    .filter-select {
      padding: 0.65rem 1rem;
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 8px;
      color: #fff;
      font-size: 0.9rem;
      cursor: pointer;
      outline: none;
    }
    .filter-select:focus { border-color: #e50914; }
    .btn-clear {
      padding: 0.65rem 1.2rem;
      background: transparent;
      border: 1px solid #444;
      border-radius: 8px;
      color: #aaa;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .btn-clear:hover { border-color: #e50914; color: #e50914; }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.25rem;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: #666;
      font-size: 1rem;
    }
    .error-banner {
      background: #3a1a1a;
      border: 1px solid #e50914;
      color: #ff6b6b;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2.5rem;
    }
    .page-btn {
      padding: 0.5rem 0.9rem;
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 6px;
      color: #ccc;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .page-btn:hover:not(:disabled) { border-color: #e50914; color: #fff; }
    .page-btn.active { background: #e50914; border-color: #e50914; color: #fff; }
    .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  `],
})
export class HomeComponent implements OnInit, OnDestroy {
  private movieService = inject(MovieService);
  private favoriteService = inject(FavoriteService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);

  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  favoriteIds = new Set<number>();

  searchQuery = '';
  selectedGenre = '';
  selectedYear = '';
  loading = false;
  error = '';

  // Pagination
  currentPage = 1;
  pageSize = 12;

  // Debounce
  private searchSubject = new Subject<string>();
  private sub!: Subscription;

  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Crime', 'Romance', 'Animation'];
  years = Array.from({ length: 35 }, (_, i) => String(2024 - i));

  get totalPages() {
    return Math.ceil(this.filteredMovies.length / this.pageSize);
  }

  get paginatedMovies() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMovies.slice(start, start + this.pageSize);
  }

  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadMovies();

    if (this.auth.isLoggedIn()) {
      this.loadFavorites();
    }

    // Debounce search — 400ms
    this.sub = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  loadMovies() {
    this.loading = true;
    this.error = '';
    this.movieService.getMovies().subscribe({
      next: movies => {
        this.movies = movies;
        this.filteredMovies = movies;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load movies. Make sure the backend is running.';
        this.loading = false;
      },
    });
  }

  loadFavorites() {
    this.favoriteService.getFavorites().subscribe({
      next: favs => {
        this.favoriteIds = new Set(favs.map(f => f.movie));
      },
    });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  applyFilters() {
    this.currentPage = 1;
    this.filteredMovies = this.movies.filter(m => {
      const matchesSearch = !this.searchQuery ||
        m.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesGenre = !this.selectedGenre ||
        m.genre.toLowerCase() === this.selectedGenre.toLowerCase();
      const matchesYear = !this.selectedYear ||
        String(m.year) === this.selectedYear;
      return matchesSearch && matchesGenre && matchesYear;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedGenre = '';
    this.selectedYear = '';
    this.filteredMovies = this.movies;
    this.currentPage = 1;
  }

  isFavorited(movieId: number) {
    return this.favoriteIds.has(movieId);
  }

  toggleFavorite(movie: Movie) {
    if (!this.auth.isLoggedIn()) {
      this.toast.info('Please log in to save favorites.');
      return;
    }

    if (this.favoriteIds.has(movie.id)) {
      this.favoriteService.removeFavorite(movie.id).subscribe({
        next: () => {
          this.favoriteIds.delete(movie.id);
          this.toast.success(`Removed "${movie.title}" from favorites.`);
        },
        error: () => this.toast.error('Failed to remove from favorites.'),
      });
    } else {
      this.favoriteService.addFavorite(movie.id).subscribe({
        next: () => {
          this.favoriteIds.add(movie.id);
          this.toast.success(`Added "${movie.title}" to favorites.`);
        },
        error: () => this.toast.error('Failed to add to favorites.'),
      });
    }
  }

  changePage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Movie, Review } from '../../models';
import { MovieService } from '../../services/movie.service';
import { ReviewService } from '../../services/review.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, StarRatingComponent, ReviewCardComponent],
  template: `
    <!-- Loading -->
    @if (loading) {
      <div class="loading">Loading...</div>
    }

    <!-- Error -->
    @if (error && !loading) {
      <div class="error-page">
        <p>{{ error }}</p>
        <a routerLink="/home" class="btn-back">← Back to Movies</a>
      </div>
    }

    @if (movie && !loading) {
      <!-- Hero -->
      <div class="hero" [style.backgroundImage]="movie.poster_url ? 'url(' + movie.poster_url + ')' : 'none'">
        <div class="hero-overlay">
          <div class="hero-content">
            @if (movie.poster_url) {
              <img [src]="movie.poster_url" [alt]="movie.title" class="poster" />
            } @else {
              <div class="poster-placeholder">🎬</div>
            }
            <div class="hero-info">
              <div class="hero-meta">
                <span class="genre">{{ movie.genre }}</span>
                <span class="year">{{ movie.year }}</span>
              </div>
              <h1>{{ movie.title }}</h1>
              <div class="rating-row">
                <app-star-rating [value]="movie.average_rating" [showValue]="true"></app-star-rating>
                <span class="review-count">({{ reviews.length }} reviews)</span>
              </div>
              <p class="description">{{ movie.description }}</p>
              <div class="hero-actions">
                <a routerLink="/home" class="btn-back">← Back</a>
                @if (auth.isLoggedIn()) {
                  <button class="btn-fav" [class.active]="isFavorited" (click)="toggleFavorite()">
                    {{ isFavorited ? '♥ In Favorites' : '♡ Add to Favorites' }}
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <h2>Reviews</h2>

        <!-- Add Review Form (logged in + not yet reviewed) -->
        @if (auth.isLoggedIn() && !userHasReviewed) {
          <div class="review-form-card">
            <h3>Write a Review</h3>

            <div class="form-group">
              <label>Your Rating</label>
              <app-star-rating
                [value]="newReview.rating"
                [interactive]="true"
                (valueChange)="newReview.rating = $event">
              </app-star-rating>
            </div>

            <div class="form-group">
              <label>Your Review</label>
              <textarea
                class="textarea"
                [(ngModel)]="newReview.text"
                placeholder="What did you think about this movie?"
                rows="4">
              </textarea>
            </div>

            @if (reviewError) {
              <div class="field-error">{{ reviewError }}</div>
            }

            <button
              class="btn-submit"
              [disabled]="submitting"
              (click)="submitReview()">
              {{ submitting ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        }

        @if (auth.isLoggedIn() && userHasReviewed) {
          <div class="already-reviewed">✓ You have reviewed this movie.</div>
        }

        @if (!auth.isLoggedIn()) {
          <div class="login-prompt">
            <a routerLink="/login">Log in</a> to write a review.
          </div>
        }

        <!-- Reviews list -->
        @if (reviewsLoading) {
          <div class="loading-small">Loading reviews...</div>
        } @else if (reviews.length === 0) {
          <div class="no-reviews">No reviews yet. Be the first!</div>
        } @else {
          <div class="reviews-list">
            @for (review of reviews; track review.id) {
              <app-review-card
              [review]="review"
              [canDelete]="review.username === currentUsername"
              (deleted)="deleteReview($event)"
              (updated)="updateReview($event)">

              </app-review-card>
            }
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .loading, .loading-small {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
    .error-page {
      text-align: center;
      padding: 4rem;
      color: #aaa;
    }

    /* Hero */
    .hero {
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .hero-overlay {
      background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(15,15,15,1) 100%);
      padding: 3rem 2rem 2rem;
    }
    .hero-content {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      gap: 2.5rem;
      align-items: flex-start;
    }
    .poster {
      width: 200px;
      border-radius: 10px;
      flex-shrink: 0;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    }
    .poster-placeholder {
      width: 200px;
      height: 300px;
      background: #1e1e1e;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      flex-shrink: 0;
    }
    .hero-info { flex: 1; }
    .hero-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.6rem;
    }
    .genre {
      font-size: 0.8rem;
      color: #e50914;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .year { font-size: 0.8rem; color: #888; }
    .hero-info h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      margin: 0 0 0.75rem;
    }
    .rating-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .review-count { font-size: 0.85rem; color: #888; }
    .description { color: #ccc; line-height: 1.7; margin-bottom: 1.5rem; }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-back {
      padding: 0.6rem 1.2rem;
      background: #2a2a2a;
      color: #ccc;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .btn-back:hover { background: #3a3a3a; }
    .btn-fav {
      padding: 0.6rem 1.4rem;
      background: transparent;
      border: 2px solid #e50914;
      color: #e50914;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn-fav:hover, .btn-fav.active {
      background: #e50914;
      color: #fff;
    }

    /* Reviews section */
    .reviews-section {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }
    .reviews-section h2 {
      font-size: 1.4rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #2a2a2a;
      padding-bottom: 0.75rem;
    }
    .review-form-card {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .review-form-card h3 {
      font-size: 1rem;
      color: #fff;
      margin-bottom: 1.2rem;
    }
    .form-group { margin-bottom: 1rem; }
    .form-group label {
      display: block;
      font-size: 0.85rem;
      color: #aaa;
      margin-bottom: 0.4rem;
    }
    .textarea {
      width: 100%;
      background: #111;
      border: 1px solid #333;
      border-radius: 8px;
      color: #fff;
      padding: 0.75rem;
      font-size: 0.9rem;
      resize: vertical;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .textarea:focus { border-color: #e50914; }
    .field-error {
      color: #ff6b6b;
      font-size: 0.82rem;
      margin-bottom: 0.75rem;
    }
    .btn-submit {
      padding: 0.65rem 1.6rem;
      background: #e50914;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: #c40812; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .already-reviewed {
      background: #1a3a2a;
      border: 1px solid #2ecc71;
      color: #2ecc71;
      padding: 0.75rem 1.2rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    .login-prompt {
      color: #888;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    .login-prompt a { color: #e50914; }
    .no-reviews {
      text-align: center;
      color: #666;
      padding: 2rem;
    }
    .reviews-list { display: flex; flex-direction: column; gap: 1rem; }
  `],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private reviewService = inject(ReviewService);
  private favoriteService = inject(FavoriteService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);

  movie: Movie | null = null;
  reviews: Review[] = [];
  isFavorited = false;
  loading = true;
  reviewsLoading = false;
  error = '';
  reviewError = '';
  submitting = false;

  newReview = { text: '', rating: 0 };
  
  get currentUsername() {

  return this.auth.currentUsername() || '';

}

  get userHasReviewed() {
    return this.reviews.some(r => r.user === this.auth.currentUserId());
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie(id);
    this.loadReviews(id);

    if (this.auth.isLoggedIn()) {
      this.checkFavorite(id);
    }
  }

  loadMovie(id: number) {
    this.movieService.getMovie(id).subscribe({
      next: movie => { this.movie = movie; this.loading = false; },
      error: () => { this.error = 'Movie not found.'; this.loading = false; },
    });
  }

  loadReviews(id: number) {
    this.reviewsLoading = true;
    this.reviewService.getReviews(id).subscribe({
      next: reviews => { this.reviews = reviews; this.reviewsLoading = false; },
      error: () => { this.reviewsLoading = false; },
    });
  }

  checkFavorite(movieId: number) {
    this.favoriteService.getFavorites().subscribe({
      next: favs => { this.isFavorited = favs.some(f => f.movie === movieId); },
    });
  }

  toggleFavorite() {
    if (!this.movie) return;
    const id = this.movie.id;

    if (this.isFavorited) {
      this.favoriteService.removeFavorite(id).subscribe({
        next: () => { this.isFavorited = false; this.toast.success('Removed from favorites.'); },
        error: () => this.toast.error('Failed to remove from favorites.'),
      });
    } else {
      this.favoriteService.addFavorite(id).subscribe({
        next: () => { this.isFavorited = true; this.toast.success('Added to favorites!'); },
        error: () => this.toast.error('Failed to add to favorites.'),
      });
    }
  }

  submitReview() {
    this.reviewError = '';

    if (!this.newReview.rating) {
      this.reviewError = 'Please select a star rating.';
      return;
    }
    if (!this.newReview.text.trim()) {
      this.reviewError = 'Review text cannot be empty.';
      return;
    }

    this.submitting = true;
    const movieId = this.movie!.id;

    this.reviewService.createReview(movieId, this.newReview).subscribe({
      next: review => {
        this.reviews = [review, ...this.reviews];
        this.newReview = { text: '', rating: 0 };
        this.submitting = false;
        this.toast.success('Review submitted!');
      },
      error: (err) => {
        this.submitting = false;
        const msg = err?.error?.error || 'Failed to submit review.';
        this.reviewError = msg;
        this.toast.error(msg);
      },
    });
  }

  deleteReview(reviewId: number) {
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.toast.success('Review deleted.');
      },
      error: () => this.toast.error('Failed to delete review.'),
    });
  }

  updateReview(event: { id: number; text: string; rating: number }) {
  console.log('DETAIL UPDATE EVENT', event);

  this.reviewService.updateReview(event.id, {
    text: event.text,
    rating: event.rating
  }).subscribe({
    next: (updatedReview) => {
      console.log('DETAIL UPDATED REVIEW', updatedReview);
      this.reviews = this.reviews.map(r =>
        r.id === event.id ? updatedReview : r
      );
    },
    error: (err) => {
      console.log('DETAIL UPDATE ERROR', err);
      this.error = 'Failed to update review.';
    }
  });
}
}
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService, UserProfile } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';
import { ToastService } from '../../services/toast.service';
import { Review } from '../../models';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterLink, ReviewCardComponent],
  template: `
    <div class="page">

      @if (loading) {
        <div class="loading">Loading profile...</div>
      } @else {
        <div class="profile-header">
          <div class="avatar">{{ username ? username[0].toUpperCase() : '' }}</div>
          <div>
            <h1>{{ username }}</h1>
            <p class="email">{{ profile?.user?.email }}</p>
          </div>
        </div>

        <!-- Bio Section -->
        <div class="section-card">
          <h2>About Me</h2>

          @if (!editingBio) {
            <p class="bio-text">{{ profile?.bio || 'No bio yet.' }}</p>
            <button class="btn-edit" (click)="editingBio = true">Edit Bio</button>
          } @else {
            <textarea
              class="textarea"
              [(ngModel)]="bioInput"
              placeholder="Write something about yourself..."
              rows="3">
            </textarea>
            <div class="btn-group">
              <button class="btn-save" (click)="saveBio()">Save</button>
              <button class="btn-cancel" (click)="cancelEdit()">Cancel</button>
            </div>
          }
        </div>

        <!-- Error -->
        @if (error) {
          <div class="error-banner">⚠️ {{ error }}</div>
        }

        <!-- My Reviews -->
        <div class="section-card">
          <h2>My Reviews <span class="count">({{ myReviews.length }})</span></h2>

          @if (reviewsLoading) {
            <div class="loading-small">Loading...</div>
          } @else if (myReviews.length === 0) {
            <div class="empty-text">
              You haven't written any reviews yet.
              <a routerLink="/home">Browse movies</a>
            </div>
          } @else {
            <div class="reviews-list">
              @for (review of myReviews; track review.id) {
                <app-review-card
                [review]="review"
                [canDelete]="true"
                (deleted)="deleteReview($event)"
                (updated)="updateReview($event)">
              </app-review-card>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .loading, .loading-small { text-align: center; padding: 3rem; color: #666; }
    .error-banner {
      background: #3a1a1a;
      border: 1px solid #e50914;
      color: #ff6b6b;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .profile-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #e50914;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
    }
    .profile-header h1 { font-size: 1.6rem; color: #fff; margin-bottom: 0.2rem; }
    .email { color: #888; font-size: 0.9rem; }
    .section-card {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .section-card h2 {
      font-size: 1.1rem;
      color: #fff;
      margin-bottom: 1rem;
    }
    .count { font-size: 0.85rem; color: #888; }
    .bio-text { color: #ccc; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem; }
    .btn-edit {
      background: transparent;
      border: 1px solid #444;
      color: #aaa;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-edit:hover { border-color: #e50914; color: #e50914; }
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
      margin-bottom: 0.75rem;
    }
    .textarea:focus { border-color: #e50914; }
    .btn-group { display: flex; gap: 0.75rem; }
    .btn-save {
      padding: 0.5rem 1.2rem;
      background: #e50914;
      border: none;
      border-radius: 6px;
      color: #fff;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .btn-save:hover { background: #c40812; }
    .btn-cancel {
      padding: 0.5rem 1.2rem;
      background: transparent;
      border: 1px solid #444;
      border-radius: 6px;
      color: #aaa;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .empty-text { color: #888; font-size: 0.9rem; }
    .empty-text a { color: #e50914; }
    .reviews-list { display: flex; flex-direction: column; gap: 1rem; }
  `],
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private reviewService = inject(ReviewService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  profile: UserProfile | null = null;
  myReviews: Review[] = [];
  loading = true;
  reviewsLoading = false;
  error = '';
  editingBio = false;
  bioInput = '';


  get username() {
  return this.auth.currentUsername() || '';
}

ngOnInit() {
  this.userService.getProfile().subscribe({
    next: p => {
      this.profile = p;
      this.bioInput = p.bio || '';
      this.loading = false;
      this.loadMyReviews();
    },
    error: () => {
      this.error = 'Failed to load profile.';
      this.loading = false;
    },
  });
}

loadMyReviews() {
  this.reviewsLoading = true;
  this.reviewService.getMyReviews().subscribe({
    next: reviews => {
      this.myReviews = reviews;
      this.reviewsLoading = false;
    },
    error: () => {
      this.error = 'Failed to load your reviews.';
      this.reviewsLoading = false;
    }
  });
}

  saveBio() {
    this.userService.updateProfile({ bio: this.bioInput }).subscribe({
      next: p => {
        this.profile = p;
        this.editingBio = false;
        this.toast.success('Bio updated!');
      },
      error: () => this.toast.error('Failed to update bio.'),
    });
  }

  cancelEdit() {
    this.bioInput = this.profile?.bio || '';
    this.editingBio = false;
  }

  deleteReview(reviewId: number) {
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.myReviews = this.myReviews.filter(r => r.id !== reviewId);
        this.toast.success('Review deleted.');
      },
      error: () => this.toast.error('Failed to delete review.'),
    });
  }

  updateReview(event: { id: number; text: string; rating: number }) {
  this.reviewService.updateReview(event.id, {
    text: event.text,
    rating: event.rating
  }).subscribe({
    next: (updatedReview) => {
      this.myReviews = this.myReviews.map(r =>
        r.id === event.id ? updatedReview : r
      );
      this.toast.success('Review updated.');
    },
    error: () => this.toast.error('Failed to update review.')
  });
}
}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../models';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  template: `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer">
          <div class="avatar">{{ review.username[0].toUpperCase() }}</div>
          <div>
            <span class="username">{{ review.username }}</span>
            <span class="date">{{ review.created_at | date: 'MMM d, y' }}</span>
          </div>
        </div>
        <app-star-rating [value]="review.rating" [showValue]="true"></app-star-rating>
      </div>

      <p class="review-text">{{ review.text }}</p>

      @if (canDelete) {
        <div class="review-actions">
          <button class="btn-delete" (click)="onDelete()">Delete</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .review-card {
      background: #1e1e1e;
      border: 1px solid #2a2a2a;
      border-radius: 10px;
      padding: 1.2rem;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    .reviewer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #e50914;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      color: #fff;
      flex-shrink: 0;
    }
    .username {
      display: block;
      font-weight: 600;
      font-size: 0.9rem;
      color: #eee;
    }
    .date {
      font-size: 0.75rem;
      color: #777;
    }
    .review-text {
      color: #ccc;
      font-size: 0.9rem;
      line-height: 1.6;
      margin: 0 0 0.5rem;
    }
    .review-actions { text-align: right; }
    .btn-delete {
      background: transparent;
      border: 1px solid #444;
      color: #e50914;
      padding: 0.3rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    .btn-delete:hover { background: #e50914; color: #fff; border-color: #e50914; }
  `],
})
export class ReviewCardComponent {
  @Input() review!: Review;
  @Input() canDelete = false;
  @Output() deleted = new EventEmitter<number>();

  onDelete() {
    this.deleted.emit(this.review.id);
  }
}
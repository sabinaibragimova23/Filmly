import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../../models';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  template: `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer">
          <div class="avatar">{{ review.username[0].toUpperCase() }}</div>
          <div>
            <span class="username">{{ review.username }}</span>
            <span class="date">{{ review.created_at | date: 'MMM d, y' }}</span>

            @if (review.movie_title) {
              <div class="movie-title">
                Movie: {{ review.movie_title }}
              </div>
            }
          </div>
        </div>

        <app-star-rating [value]="review.rating" [showValue]="true"></app-star-rating>
      </div>

      @if (!editing) {
        <p class="review-text">{{ review.text }}</p>
      } @else {
        <div class="edit-form">
          <textarea
            [(ngModel)]="editText"
            class="textarea"
            rows="3"
            placeholder="Edit your review...">
          </textarea>

          <input
            [(ngModel)]="editRating"
            type="number"
            min="1"
            max="5"
            class="rating-input"
            placeholder="Rating (1-5)" />
        </div>
      }

      @if (canDelete) {
        <div class="review-actions">
          @if (!editing) {
            <button class="btn-edit" (click)="startEdit()">Edit</button>
            <button class="btn-delete" (click)="onDelete()">Delete</button>
          } @else {
            <button class="btn-save" (click)="onSave()">Save</button>
            <button class="btn-cancel" (click)="cancelEdit()">Cancel</button>
          }
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
      display: block;
      font-size: 0.75rem;
      color: #777;
    }

    .movie-title {
      margin-top: 0.25rem;
      font-size: 0.8rem;
      color: #e50914;
      font-weight: 500;
    }

    .review-text {
      color: #ccc;
      font-size: 0.9rem;
      line-height: 1.6;
      margin: 0 0 0.5rem;
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .textarea,
    .rating-input {
      width: 100%;
      background: #111;
      border: 1px solid #333;
      border-radius: 8px;
      color: #fff;
      padding: 0.75rem;
      font-size: 0.9rem;
      box-sizing: border-box;
    }

    .review-actions {
      text-align: right;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .btn-edit,
    .btn-delete,
    .btn-save,
    .btn-cancel {
      padding: 0.3rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }

    .btn-edit {
      background: transparent;
      border: 1px solid #555;
      color: #ddd;
    }

    .btn-edit:hover {
      border-color: #e50914;
      color: #e50914;
    }

    .btn-delete {
      background: transparent;
      border: 1px solid #444;
      color: #e50914;
    }

    .btn-delete:hover {
      background: #e50914;
      color: #fff;
      border-color: #e50914;
    }

    .btn-save {
      background: #e50914;
      border: none;
      color: #fff;
    }

    .btn-save:hover {
      background: #c40812;
    }

    .btn-cancel {
      background: transparent;
      border: 1px solid #444;
      color: #aaa;
    }
  `],
})
export class ReviewCardComponent {
  @Input() review!: Review;
  @Input() canDelete = false;

  @Output() deleted = new EventEmitter<number>();
  @Output() updated = new EventEmitter<{ id: number; text: string; rating: number }>();

  editing = false;
  editText = '';
  editRating = 5;

  onDelete() {
    this.deleted.emit(this.review.id);
  }

  startEdit() {
    this.editing = true;
    this.editText = this.review.text;
    this.editRating = this.review.rating;
  }

  cancelEdit() {
    this.editing = false;
    this.editText = this.review.text;
    this.editRating = this.review.rating;
  }

  onSave() {
  this.updated.emit({
    id: this.review.id,
    text: this.editText,
    rating: this.editRating
  });
  this.editing = false;
}
}
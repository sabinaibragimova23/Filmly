import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="stars">
      @for (star of stars; track star) {
        <span
          class="star"
          [class.filled]="star <= (hovered || value)"
          [class.interactive]="interactive"
          (mouseenter)="interactive && (hovered = star)"
          (mouseleave)="interactive && (hovered = 0)"
          (click)="interactive && select(star)">
          ★
        </span>
      }
      @if (showValue && value > 0) {
        <span class="value">{{ value }}/5</span>
      }
    </div>
  `,
  styles: [`
    .stars { display: flex; align-items: center; gap: 2px; }
    .star {
      font-size: 1.2rem;
      color: #444;
      transition: color 0.15s;
      line-height: 1;
    }
    .star.filled { color: #f5c518; }
    .star.interactive { cursor: pointer; }
    .star.interactive:hover { transform: scale(1.15); }
    .value { font-size: 0.8rem; color: #aaa; margin-left: 4px; }
  `],
})
export class StarRatingComponent {
  @Input() value = 0;
  @Input() interactive = false;
  @Input() showValue = false;
  @Output() valueChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hovered = 0;

  select(star: number) {
    this.value = star;
    this.valueChange.emit(star);
  }
}
import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type">
          <span>{{ toast.message }}</span>
          <button (click)="toastService.remove(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: 9999;
    }
    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1.2rem;
      border-radius: 8px;
      min-width: 280px;
      font-size: 0.9rem;
      animation: slideIn 0.25s ease;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }
    .toast-success { background: #1a3a2a; border-left: 4px solid #2ecc71; color: #eee; }
    .toast-error   { background: #3a1a1a; border-left: 4px solid #e50914; color: #eee; }
    .toast-info    { background: #1a2a3a; border-left: 4px solid #3498db; color: #eee; }
    .toast button {
      background: transparent;
      border: none;
      color: #aaa;
      cursor: pointer;
      font-size: 0.85rem;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
  `],
})
export class ToastComponent {
  toastService = inject(ToastService);
}
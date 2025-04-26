import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastInfo } from '../../services/toast.service';

// Extended interface to include the timeoutId
interface ExtendedToast extends ToastInfo {
  id: number;
  timeoutId?: ReturnType<typeof setTimeout>;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" 
           class="toast" 
           [class.toast-success]="toast.type === 'success'"
           [class.toast-error]="toast.type === 'error'"
           [class.toast-info]="toast.type === 'info'"
           [class.toast-warning]="toast.type === 'warning'">
        <div class="toast-header">
          <i *ngIf="toast.type === 'success'" class="fas fa-check-circle"></i>
          <i *ngIf="toast.type === 'error'" class="fas fa-exclamation-circle"></i>
          <i *ngIf="toast.type === 'info'" class="fas fa-info-circle"></i>
          <i *ngIf="toast.type === 'warning'" class="fas fa-exclamation-triangle"></i>
          <span class="toast-title">
            {{ toast.type === 'success' ? 'Success' : 
               toast.type === 'error' ? 'Error' : 
               toast.type === 'warning' ? 'Warning' : 'Information' }}
          </span>
          <button class="close-btn" (click)="removeToast(toast)">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
    }
    
    .toast {
      background-color: white;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      animation: slideIn 0.3s ease;
      border-left: 4px solid #ccc;
    }
    
    .toast-success {
      border-left-color: #2ecc71;
    }
    
    .toast-error {
      border-left-color: #e74c3c;
    }
    
    .toast-info {
      border-left-color: #3498db;
    }
    
    .toast-warning {
      border-left-color: #f39c12;
    }
    
    .toast-header {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #eee;
    }
    
    .toast-header i {
      margin-right: 8px;
      font-size: 16px;
    }
    
    .toast-header .fa-check-circle {
      color: #2ecc71;
    }
    
    .toast-header .fa-exclamation-circle {
      color: #e74c3c;
    }
    
    .toast-header .fa-info-circle {
      color: #3498db;
    }
    
    .toast-header .fa-exclamation-triangle {
      color: #f39c12;
    }
    
    .toast-title {
      flex-grow: 1;
      font-weight: 600;
      font-size: 14px;
    }
    
    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #6c757d;
      font-size: 14px;
    }
    
    .toast-body {
      padding: 15px;
      font-size: 14px;
      line-height: 1.5;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: ExtendedToast[] = [];
  private subscription: Subscription = new Subscription();
  private counter = 0;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      this.addToast(toast);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    // Clear any remaining timeouts
    this.toasts.forEach(toast => {
      if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
      }
    });
  }

  addToast(toast: ToastInfo): void {
    const id = ++this.counter;
    const newToast: ExtendedToast = { ...toast, id };
    this.toasts.push(newToast);
    
    // Auto-remove after duration
    const timeoutId = setTimeout(() => {
      this.removeToast(newToast);
    }, toast.duration || 3000);
    
    // Store the timeout ID to clear it if needed
    newToast.timeoutId = timeoutId;
  }

  removeToast(toast: ExtendedToast): void {
    // Clear the timeout to prevent duplicate removals
    if (toast.timeoutId) {
      clearTimeout(toast.timeoutId);
    }
    
    // Remove the toast from the array
    this.toasts = this.toasts.filter(t => t.id !== toast.id);
  }
} 
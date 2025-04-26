import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastInfo {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastInfo>();
  public toast$ = this.toastSubject.asObservable();

  constructor() { }

  showSuccess(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration: number = 5000): void {
    this.show(message, 'error', duration);
  }

  showInfo(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  showWarning(message: string, duration: number = 4000): void {
    this.show(message, 'warning', duration);
  }

  private show(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number): void {
    this.toastSubject.next({ message, type, duration });
  }
} 
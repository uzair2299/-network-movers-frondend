import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new Subject<Toast[]>();

  constructor() {}

  getToasts(): Observable<Toast[]> {
    return this.toastsSubject.asObservable();
  }

  showSuccess(message: string, title?: string) {
    this.show(message, 'success', title);
  }

  showError(message: string, title?: string) {
    this.show(message, 'error', title);
  }

  showInfo(message: string, title?: string) {
    this.show(message, 'info', title);
  }

  showWarning(message: string, title?: string) {
    this.show(message, 'warning', title);
  }

  private show(message: string, type: ToastType, title?: string) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, title };
    
    this.toasts.push(toast);
    this.toastsSubject.next([...this.toasts]);

    // Automatically remove toast after 4 seconds
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastsSubject.next([...this.toasts]);
  }
}

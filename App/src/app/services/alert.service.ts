import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  alert$ = this.alertSubject.asObservable();

  showAlert(type: "success" | "error" | "warning" | "info", message: string | null) {
    this.alertSubject.next({ type, message });

    // Auto-hide after 3 seconds
    setTimeout(() => this.clearAlert(), 3000);
  }

  clearAlert() {
    this.alertSubject.next(null);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  protected router = inject(Router);
  protected authService = inject(AuthService);

  isAuthenticated = false;
  isAdmin = false;
  userType: 'employee' | 'client' | null = null;

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    const permissions = this.authService.getUserPermissions();

    if (this.isAuthenticated) {
      this.isAdmin = permissions?.includes('admin') || false;
      this.userType = this.authService.getUserType();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

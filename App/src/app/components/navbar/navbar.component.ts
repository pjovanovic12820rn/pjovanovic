import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  isAuthenticated: boolean = false;
  isLoginPage: boolean = false;
  userRole: string | null = null;

  ngOnInit(): void {
    this.checkAuthStatus();

    // Hide navbar on login page
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });
  }

  checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userRole = this.authService.getUserPermissions();
  }

  AllEmployees(): void {
    this.router.navigate(['/employees']);
  }

  AllUsers(): void {
    this.router.navigate(['/users']);
  }

  MyProfile(): void {
    if (this.userRole === 'employee') {
      this.router.navigate(['/employees', this.authService.getUserId()]);
    } else {
      this.router.navigate(['/users', this.authService.getUserId()]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}

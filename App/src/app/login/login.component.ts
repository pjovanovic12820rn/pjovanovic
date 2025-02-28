import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  userType: 'client' | 'employee' = 'client'; // Default to client login

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Determine if the route is /login/client or /login/employee
    this.route.url.subscribe(segments => {
      if (segments.some(segment => segment.path === 'employee')) {
        this.userType = 'employee';
      } else {
        this.userType = 'client';
      }
    });
  }

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required!';
      return;
    }

    this.authService.login(this.email, this.password, this.userType).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        const role = this.authService.getUserPermissions();
        const userId = this.authService.getUserId();

        console.log(`UserType: ${this.userType}, Role: ${role}, UserId: ${userId}`);

        if (role?.includes('admin')) {
          this.router.navigate(['employees']);
        } else if (role?.includes('employee')) {
          this.router.navigate([`employee/${userId}`]);
        } else if (role?.includes('user')) {
          this.router.navigate([`user/${userId}`]);
        } else {
          this.errorMessage = 'Unknown role. Cannot determine redirection.';
        }
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }

  passwordForgot() {
    this.router.navigate(['/reset-password']);
  }

  register() {
    this.router.navigate(['/register']);
  }
}

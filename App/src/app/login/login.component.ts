import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required!';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token); // Save JWT token

        const role = this.authService.getUserPermissions();
        const userId = this.authService.getUserId();

        console.log(role)
        console.log(userId)

        if (role?.includes('admin')) {
          console.log("Navigiram")
          this.router.navigate(['employees']);
        } else if (role === 'employee') {
          console.log("Navig2")
          this.router.navigate([`employee/${userId}`]);
        } else if (role === 'user') {
          console.log("Navig3")
          this.router.navigate([`user/${userId}`]);
        } else {
          console.log("Navig4")
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

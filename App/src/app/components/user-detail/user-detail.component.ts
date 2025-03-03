import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  user: User | null = null;
  errorMessage: string | null = null;

  get isAdmin(): boolean {
    return <boolean>this.authService.getUserPermissions()?.includes("admin");
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getUserSelf().subscribe({
      next: (fetchedUser) => {
        if (!fetchedUser) {
          this.errorMessage = 'User not found.';
          this.router.navigate(['/']); // Redirect if user not found
          return;
        }
        this.user = fetchedUser;
      },
      error: () => {
        this.errorMessage = 'Failed to load user details. Please try again later.';
      }
    });
  }
}

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  user: User | null = null;
  errorMessage: string | null = null;

  get isAdmin(): boolean {
    return this.authService.getUserPermissions() === 'admin';
  }

  ngOnInit(): void {
    let userId: number | null = null;
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      userId = Number(idParam);
      if (isNaN(userId)) {
        this.errorMessage = 'Invalid user ID.';
        return;
      }
    }

    if (userId !== null) {
      this.loadUser(userId);
    } else {
      this.errorMessage = 'No user information available.';
    }
  }

  loadUser(userId: number): void {
    this.userService.getUserById(userId).subscribe({
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

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  user: User | null = null;
  errorMessage: string | null = null;

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  ngOnInit(): void {
    // Pročitamo parametar 'id' iz URL-a.
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage = 'No user ID provided.';
      return;
    }
    const userId = Number(idParam);

    if (isNaN(userId)) {
      this.errorMessage = 'Invalid user ID.';
      return;
    }


    this.userService.getUserById(userId).subscribe({
      next: (fetchedUser) => {
        if (!fetchedUser) {
          this.errorMessage = 'User not found.';
          return;
        }
        this.user = fetchedUser;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.errorMessage = 'Failed to load user details. Please try again later.';
      }
    });
  }
}

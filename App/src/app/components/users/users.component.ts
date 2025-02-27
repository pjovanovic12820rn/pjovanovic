import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [CommonModule],
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  users: User[] = [];
  errorMessage: string | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalUsers: number = 0;

  get isAdmin(): boolean {
    return this.authService.getUserPermissions() === 'admin';
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.users = data.content;
        this.totalUsers = data.totalElements; // Total number of users
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Failed to load users. Please try again later.';
      },
    });
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalUsers) {
      this.currentPage++;
      this.fetchUsers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchUsers();
    }
  }

  deleteUser(userId: number): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Only admins can delete users.';
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== userId);
        },
        error: () => {
          this.errorMessage = 'Failed to delete user. Please try again.';
        },
      });
    }
  }

  editUser(userId: number): void {
    this.router.navigate(['/users', userId]);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [CommonModule, RouterLink],
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);

  users: User[] = [];
  errorMessage: string | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalUsers: number = 0; // Assuming backend provides total count

  get isAdmin(): boolean {
    return this.userService['authService'].isAdmin;
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.users = data.content;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = 'Failed to load users. Please try again later.';
      },
    });
  }

  nextPage() {
    this.currentPage++;
    this.fetchUsers();
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchUsers();
    }
  }

  deleteUser(userId: number) {
    if (!this.isAdmin) {
      this.errorMessage = 'Only admins can delete users.';
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== userId);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.errorMessage = err.message || 'Failed to delete user.';
        },
      });
    }
  }
}

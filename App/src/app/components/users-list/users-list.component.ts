import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Employee } from '../../models/employee.model';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  users: User[] = [];
  employees: Employee[] = [];
  errorMessage: string | null = null;

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  ngOnInit(): void {
    if (this.isAdmin) {
      this.userService.getAllUsers().subscribe({
        next: (data) => {
          this.users = data.content;
        },
        error: () => {
          this.errorMessage = 'Failed to load users. Please try again later.';
        }
      });

    } else {
      this.errorMessage = 'You are not authorized to view this content.';
    }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  userForm!: FormGroup;
  userId!: number;
  errorMessage: string | null = null;
  userLoaded = false;

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage = 'No user ID provided.';
      return;
    }

    this.userId = +idParam;
    if (isNaN(this.userId)) {
      this.errorMessage = 'Invalid user ID.';
      return;
    }

    this.userService.getUserById(this.userId).subscribe({
      next: (foundUser) => {
        if (!foundUser) {
          this.errorMessage = 'User not found.';
          return;
        }
        this.initForm(foundUser);
        this.userLoaded = true;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.errorMessage = 'Error loading user. Please try again.';
      },
    });
  }

  initForm(user: User) {
    this.userForm = this.fb.group({
      firstName: [user.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [user.lastName, [Validators.required, Validators.minLength(2)]],
      email: [user.email, [Validators.required, Validators.email]],
      phone: [user.phone],
      address: [user.address],
      isActive: [user.isActive ?? true],
    });
  }

  saveChanges(): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Only admins can update user data.';
      return;
    }

    if (this.userForm.invalid) {
      this.errorMessage = 'Form is invalid. Please fix errors before saving.';
      this.userForm.markAllAsTouched();
      return;
    }

    const updatedUser: User = {
      id: this.userId,
      ...this.userForm.value,
    };

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        // Uspešno
        this.router.navigate(['/users']); // Vrati se na listu
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.errorMessage = err.message || 'Failed to update user.';
      },
    });
  }

  hasError(controlName: string, errorCode: string): boolean {
    const control = this.userForm?.get(controlName);
    return !!(control && control.touched && control.hasError(errorCode));
  }


}

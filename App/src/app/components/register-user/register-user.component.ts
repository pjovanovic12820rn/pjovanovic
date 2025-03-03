import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  registerUserForm!: FormGroup;
  loading = false;

  get isAdmin(): boolean {
    return <boolean>this.authService.getUserPermissions()?.includes("admin");
  }

  ngOnInit(): void {
    if (!this.isAdmin) {
      this.alertService.showAlert('error', 'You do not have permission to register users.');
      this.router.navigate(['/']);
      return;
    }

    this.initForm();
  }

  initForm(): void {
    this.registerUserForm = this.fb.group({
      firstName: ['', [Validators.required, this.onlyLettersValidator, Validators.minLength(2)]],
      lastName: ['', [Validators.required, this.onlyLettersValidator, Validators.minLength(2)]],
      birthDate: ['', [Validators.required, this.pastDateValidator]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^0?[1-9][0-9]{6,14}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      jmbg: ['', [Validators.required, Validators.pattern(/^[0-9]{13}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['user', Validators.required],
    });
  }

  onSubmit(): void {
    if (!this.isAdmin) {
      this.alertService.showAlert('error', 'Only admins can register users.');
      return;
    }

    if (this.registerUserForm.invalid) {
      this.alertService.showAlert('warning', 'Please correct errors before submitting.');
      this.registerUserForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.registerUserForm.value;

    this.userService.registerUser(formData).subscribe({
      next: () => {
        this.alertService.showAlert('success', 'User registered successfully!');
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.alertService.showAlert('error', err?.error?.message || 'Failed to register user. Please try again.');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onlyLettersValidator(control: AbstractControl): ValidationErrors | null {
    return /^[A-Za-z\s]+$/.test(control.value.trim()) ? null : { onlyLetters: true };
  }

  pastDateValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const inputDate = new Date(control.value);
    return inputDate < today ? null : { invalidDate: 'Birthdate must be in the past' };
  }

  hasError(controlName: string, errorCode: string): boolean {
    const control = this.registerUserForm?.get(controlName);
    return !!(control && control.hasError(errorCode));
  }
}

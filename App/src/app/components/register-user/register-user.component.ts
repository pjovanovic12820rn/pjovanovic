import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent implements OnInit {
  registerUserForm!: FormGroup;
  isAdmin = false;
  loading = false; // ✅ Added loading state
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.isAdmin = true;
    if (!this.isAdmin) {
      this.alertService.showAlert('error', 'You do not have permission to register users.');
      this.router.navigate(['/']);
      return;
    }

    this.initForm();
  }

  initForm(): void {
    this.registerUserForm = this.fb.group({
      firstName: ['', [Validators.required, this.onlyLettersValidator, this.minLengthWithoutSpaces(2)]],
      lastName: ['', [Validators.required, this.onlyLettersValidator, this.minLengthWithoutSpaces(2)]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
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

    this.loading = true; // ✅ Prevent double submissions
    const formData = this.registerUserForm.value;

    this.userService.registerUser(formData).subscribe({
      next: () => {
        this.alertService.showAlert('success', 'User registered successfully! Activation email sent.');
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to register user. Please try again.';
        this.alertService.showAlert('error', this.errorMessage);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  minLengthWithoutSpaces(minLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return control.value.trim().length < minLength ? { minLengthWithoutSpaces: true } : null;
    };
  }

  onlyLettersValidator(control: AbstractControl): ValidationErrors | null {
    return /^[A-Za-z]+$/.test(control.value.trim()) ? null : { onlyLetters: true };
  }

  hasError(controlName: string, errorCode: string): boolean {
    const control = this.registerUserForm?.get(controlName);
    return !!(control && control.touched && control.hasError(errorCode));
  }
}

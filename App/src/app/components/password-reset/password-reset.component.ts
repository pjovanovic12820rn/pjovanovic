import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SuccessComponent } from '../success/success.component';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SuccessComponent],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  passwordForm: FormGroup;
  emailForm: FormGroup;
  passwordFeedback: string = '';
  success: boolean = false;
  emailSubmitted: boolean = false;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, this.passwordStrengthValidator.bind(this)]],
        repeatNewPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  requestPasswordReset() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const email = this.emailForm.get('email')?.value;

    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.emailSubmitted = true;
      },
      error: (err) => {
        alert('Invalid email. Please try again.');
        console.error('Error requesting password reset:', err);
      },
      complete: () => (this.loading = false)
    });
  }

  passwordsMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('repeatNewPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const lengthValid = password.length >= 8;

    let missingElements = [];
    if (!lengthValid) missingElements.push("at least 8 characters");
    if (!hasLetters) missingElements.push("at least one letter");
    if (!hasNumbers) missingElements.push("at least one number");
    if (!hasSpecial) missingElements.push("at least one special character");

    if (missingElements.length > 0) {
      this.passwordFeedback = "Password must contain: " + missingElements.join(', ');
      return { weakPassword: true };
    }

    this.passwordFeedback = "Strong password!";
    return null;
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const newPassword = this.passwordForm.get('newPassword')?.value;

    this.authService.resetPassword("", newPassword).subscribe({
      next: () => {
        this.success = true;
      },
      error: (error) => {
        alert(error);
        console.error('Error resetting password:', error);
      }
    });
  }
}

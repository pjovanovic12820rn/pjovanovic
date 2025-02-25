import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {
  passwordForm: FormGroup;
  passwordFeedback: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.passwordForm = this.fb.group(
      {
        newPassword: this.fb.control('', [Validators.required, this.passwordStrengthValidator.bind(this)]),
        repeatNewPassword: this.fb.control('', [Validators.required])
      },
      { validators: this.passwordsMatchValidator }
    );
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
      console.log('Form is invalid');
      return;
    }

    const formData = {
      newPassword: this.passwordForm.get('newPassword')?.value,
      repeatNewPassword: this.passwordForm.get('repeatNewPassword')?.value
    };

    this.authService.resetPassword("", formData.newPassword).subscribe({
      next: (message) => {
        this.router.navigate(['/success-page']); 
      },
      error: (error) => {
        alert(error); 
        console.error('Error resetting password:', error);
      }
    });
  }
}
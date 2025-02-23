import { CommonModule } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {
  passwordForm: FormGroup;
  passwordStrength: string = '';

  constructor(private fb: FormBuilder, private httpClient: HttpClient) {
    this.passwordForm = this.fb.group(
      {
        newPassword: this.fb.control('', [Validators.required]),
        repeatNewPassword: this.fb.control('', [Validators.required])
      },
      { validators: this.passwordsMatchValidator }
    );

    this.passwordForm.get('newPassword')?.valueChanges.subscribe((password) => {
      this.passwordStrength = this.checkPasswordStrength(password);
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('repeatNewPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  checkPasswordStrength(password: string): string {
    if (!password) return '';

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 6) {
      return 'Weak';
    }

    if (hasLetters && hasNumbers && password.length >= 6 && password.length < 8) {
      return 'Medium';
    }

    if (hasLetters && hasNumbers && hasSpecial && password.length >= 8) {
      return 'Strong';
    }

    return 'Weak';
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

    // Dodati pravilnu putanju
    this.httpClient.put('http://localhost:8080/api/reset-password', formData).subscribe({
      next: (res) => {
        console.log('Response:', res);
        alert('Password reset successful!');
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error('Error resetting password:', err);
        alert('Failed to reset password. Please try again.');
      }
    });
  }

}

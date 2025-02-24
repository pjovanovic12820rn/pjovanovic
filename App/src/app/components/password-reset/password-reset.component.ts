import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

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

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
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

    this.employeeService.resetPassword("", formData.newPassword).subscribe({
      next: (message) => {
        alert(message.message);
      },
      error: (error) => {
        console.error('Error reseting password:', error);
      }
    })


  }

}

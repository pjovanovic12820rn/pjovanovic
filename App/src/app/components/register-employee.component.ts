import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css']
})
export class RegisterEmployeeComponent implements OnInit {
  registerEmployeeForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.registerEmployeeForm = this.fb.group({
      firstName: ['', [Validators.required, this.onlyLettersValidator, this.minLengthWithoutSpaces(2)]],
      lastName: ['', [Validators.required, this.onlyLettersValidator, this.minLengthWithoutSpaces(2)]],
      jmbg: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      address: ['', [Validators.required, this.minLengthWithoutSpaces(5)]],
      position: ['', [Validators.required, this.onlyLettersValidator, this.minLengthWithoutSpaces(2)]],
      active: [true, Validators.required],
    });
  }

  /*
  if needed
  dob: ['', Validators.required],
  gender: ['', Validators.required],
   */

  onSubmit(): void {
    if (this.registerEmployeeForm.valid) {
      const formData = this.registerEmployeeForm.value;
      console.log("Form submitted:", this.registerEmployeeForm.value);
      console.log("FormData being sent:", formData);
      this.http.post('http://localhost:8080/api/admin/employees', formData).subscribe({
        next: (res) => {
          console.log('Employee registered:', res);
          //alert('Employee registration successful!');
          //this.registerEmployeeForm.reset();
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('POST Request Error registering employee:', err);
          //alert('Failed to register employee. Please try again.');
        }
      });
      this.router.navigate(['/users']); // move inside successful POST result after implementation
    } else {
      this.registerEmployeeForm.markAllAsTouched();
      console.log("Form is invalid:", this.registerEmployeeForm.value);
    }
  }

  minLengthWithoutSpaces(minLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const trimmedLength = control.value.trim().length;
      return trimmedLength < minLength ? { minLengthWithoutSpaces: { requiredLength: minLength, actualLength: trimmedLength } } : null;
    };
  }

  onlyLettersValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const trimmedValue = control.value.trim();
    const valid = /^[A-Za-z]+$/.test(trimmedValue);
    return valid ? null : { onlyLetters: true };
  }


}

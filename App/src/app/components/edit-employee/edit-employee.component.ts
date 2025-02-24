import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import {AbstractControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit {
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  employee: Employee | undefined;
  editForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (isNaN(id)) {
        this.errorMessage = 'Invalid employee ID.';
        return;
      }

      this.employeeService.getEmployee(id).subscribe({
        next: (employee) => {
          if (!employee) {
            this.errorMessage = 'Employee not found.';
            return;
          }
          this.employee = employee;
          this.initializeForm();
        },
        error: (error) => {
          console.error('Error fetching employee:', error);
          this.errorMessage = 'Failed to load employee details. Please try again later.';
        }
      });
    });
  }

  initializeForm(): void {
    const formattedBirthDate = this.employee?.birthDate ? this.formatDate(this.employee.birthDate) : '';

    this.editForm = this.fb.group({
      firstName: [
        this.employee?.firstName,
        [Validators.required, Validators.pattern(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/)]
      ],
      lastName: [
        this.employee?.lastName,
        [Validators.required, Validators.pattern(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/)]
      ],
      birthDate: [
        formattedBirthDate,
        [Validators.required, this.pastDateValidator]
      ],
      gender: [
        this.employee?.gender,
        [Validators.required, Validators.pattern(/^(M|F)$/)]
      ],
      email: [
        this.employee?.email,
        [Validators.required, Validators.email, Validators.pattern(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)]
      ],
      phoneNumber: [
        this.employee?.phoneNumber,
        [Validators.required, Validators.pattern(/^\+?[1-9][0-9]{6,14}$/)]
      ],
      address: [
        this.employee?.address,
        [Validators.required, Validators.minLength(5), this.noWhitespaceValidator]
      ],
      position: [
        this.employee?.position,
        [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.noWhitespaceValidator]
      ],
      department: [
        this.employee?.department,
        [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.noWhitespaceValidator]
      ],
      isActive: [
        this.employee?.isActive,
        [Validators.required]
      ]
    });
  }

  noWhitespaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return (control.value || '').trim().length === 0 ? { whitespace: true } : null;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  onSubmit(): void {
    if (!this.employeeService.isAdmin) {
      this.alertService.showAlert('error', 'Permission denied: Only admins can edit employee details.');
      return;
    }

    if (this.editForm.valid) {
      const formData = { ...this.editForm.value };
      formData.birthDate = new Date(formData.birthDate);

      this.employeeService.updateEmployee(formData).subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Employee successfully updated!');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          this.alertService.showAlert('error', 'Failed to update employee. Please try again.');
        }
      });

    } else {
      this.alertService.showAlert('warning', 'Please correct errors before submitting.');
      this.editForm.markAllAsTouched();
    }
  }

    isFieldInvalid(field: string) {
        const formControl = this.editForm.get(field);
        return formControl && formControl.invalid && (formControl.dirty || formControl.touched);
    }

    getFieldError(field: string, errorType: string) {
        const formControl = this.editForm.get(field);
        return formControl?.errors?.[errorType];
    }

  pastDateValidator(control: AbstractControl): { [key: string]: any } | null {
    const today = new Date();
    const inputDate = new Date(control.value);
    return inputDate < today ? null : { invalidDate: 'Birthdate must be in the past' };
  }

}

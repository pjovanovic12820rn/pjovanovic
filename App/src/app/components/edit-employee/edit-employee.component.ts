import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
      firstName: [this.employee?.firstName, Validators.required],
      lastName: [this.employee?.lastName, Validators.required],
      birthDate: [formattedBirthDate, Validators.required],
      gender: [this.employee?.gender, Validators.required],
      email: [this.employee?.email, [Validators.required, Validators.email]],
      phoneNumber: [this.employee?.phoneNumber, Validators.required],
      address: [this.employee?.address, Validators.required],
      position: [this.employee?.position, Validators.required],
      department: [this.employee?.department, Validators.required],
      isActive: [this.employee?.isActive, Validators.required],
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  onSubmit(): void {
    if (this.editForm.valid) {
      const formData = { ...this.editForm.value };
      formData.birthDate = new Date(formData.birthDate);

      console.log('Form submitted:', formData);
      this.router.navigate(['/employees']);
    } else {
      console.log('Form is invalid');
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
}
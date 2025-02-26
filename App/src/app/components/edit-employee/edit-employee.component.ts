import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);

  employee: Employee | null = null;
  editForm!: FormGroup;
  errorMessage: string | null = null;

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
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
      error: () => {
        this.errorMessage = 'Failed to load employee details. Please try again later.';
        this.employee = null;
      }
    });
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      firstName: [{ value: this.employee?.firstName, disabled: true }, Validators.required],
      lastName: [this.employee?.lastName, [Validators.required, Validators.pattern(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/)]],
      birthDate: [{ value: this.formatDate(this.employee?.birthDate), disabled: true }, Validators.required],
      gender: [this.employee?.gender, [Validators.required]],
      email: [{ value: this.employee?.email, disabled: true }, [Validators.required, Validators.email]],
      username: [{ value: this.employee?.username, disabled: true }, Validators.required],
      phoneNumber: [this.employee?.phoneNumber, [Validators.required, Validators.pattern(/^\+?[1-9][0-9]{6,14}$/)]],
      address: [this.employee?.address, [Validators.required, Validators.minLength(5)]],
      position: [this.employee?.position, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      department: [this.employee?.department, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      isActive: [this.employee?.active, Validators.required]
    });
  }

  private formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (!this.isAdmin) {
      this.alertService.showAlert('error', 'Permission denied: Only admins can edit employee details.');
      return;
    }

    if (this.editForm.valid) {
      const updatedEmployee: Employee = this.editForm.getRawValue();

      this.employeeService.updateEmployee(updatedEmployee).subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Employee successfully updated!');
          this.router.navigate(['/employees']);
        },
        error: () => {
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
}

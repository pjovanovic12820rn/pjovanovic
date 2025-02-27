import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);

  employee: Employee | null = null;
  editForm!: FormGroup;
  errorMessage: string | null = null;
  loading = true;
  updatingAdminStatus = false;

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(+idParam)) {
      this.errorMessage = 'Invalid employee ID.';
      return;
    }

    this.loadEmployee(+idParam);
  }

  loadEmployee(employeeId: number): void {
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (fetchedEmployee) => {
        if (!fetchedEmployee) {
          this.errorMessage = 'Employee not found.';
          return;
        }
        this.employee = fetchedEmployee;
        this.initForm();
      },
      error: () => {
        this.errorMessage = 'Failed to load employee details.';
      },
      complete: () => (this.loading = false),
    });
  }

  initForm(): void {
    if (!this.employee) return;

    this.editForm = this.fb.group({
      lastName: [this.employee.lastName, [Validators.required, Validators.minLength(2)]],
      phone: [this.employee.phoneNumber, [Validators.required, Validators.pattern(/^\+?[1-9][0-9]{6,14}$/)]],
      address: [this.employee.address, [Validators.required, Validators.minLength(5)]],
      position: [this.employee.position, [Validators.required]],
      department: [this.employee.department, [Validators.required]],
      active: [this.employee.active, Validators.required],
    });
  }

  saveChanges(): void {
    if (!this.isAdmin) {
      this.alertService.showAlert('error', 'Only admins can update employee details.');
      return;
    }

    if (this.editForm.invalid) {
      this.alertService.showAlert('warning', 'Please correct errors before submitting.');
      this.editForm.markAllAsTouched();
      return;
    }

    const updatedEmployee = {
      ...this.employee,
      ...this.editForm.value,
    };

    this.employeeService.updateEmployee(updatedEmployee).subscribe({
      next: () => {
        this.alertService.showAlert('success', 'Employee updated successfully!');
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.alertService.showAlert('error', 'Failed to update employee.');
      },
    });
  }

  toggleAdminStatus(): void {
    if (!this.employee || !this.isAdmin) return;

    this.updatingAdminStatus = true;
    const newRole = this.employee.role === 'admin' ? 'employee' : 'admin';

    this.employeeService.setEmployeeRole(this.employee.id, newRole).subscribe({
      next: () => {
        this.employee!.role = newRole;
        this.alertService.showAlert('success', `Employee is now an ${newRole.toUpperCase()}.`);
      },
      error: () => {
        this.alertService.showAlert('error', 'Failed to update employee role.');
      },
      complete: () => (this.updatingAdminStatus = false),
    });
  }
}

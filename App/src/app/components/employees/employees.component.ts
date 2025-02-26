import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  employees: Employee[] = [];
  errorMessage: string | null = null;
  showDeleteModal = false;
  selectedEmployee: Employee | null = null;

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  ngOnInit(): void {
    if (!this.isAdmin) {
      this.errorMessage = "You are not authorized to view this page.";
      return;
    }

    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.employees = response.content;
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Failed to load employees. Please try again later.';
        this.employees = [];
      }
    });
  }

  openDeleteModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.selectedEmployee = null;
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.isAdmin) {
      this.errorMessage = "You are not authorized to delete employees.";
      return;
    }

    if (this.selectedEmployee) {
      this.employeeService.deleteEmployee(this.selectedEmployee.id).subscribe({
        next: () => {
          this.employees = this.employees.filter(emp => emp.id !== this.selectedEmployee!.id);
          this.closeDeleteModal();
        },
        error: () => {
          this.errorMessage = 'Failed to delete employee. Please try again.';
        }
      });
    }
  }

  deactivateEmployee(id: number): void {
    if (!this.isAdmin) {
      this.errorMessage = "You are not authorized to deactivate employees.";
      return;
    }

    this.employeeService.deactivateEmployee(id).subscribe({
      next: () => {
        const employee = this.employees.find(emp => emp.id === id);
        if (employee) {
          employee.active = false;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to deactivate employee. Please try again.';
      }
    });
  }

  viewEmployeeDetails(id: number): void {
    this.router.navigate(['/employees', id]);
  }
}

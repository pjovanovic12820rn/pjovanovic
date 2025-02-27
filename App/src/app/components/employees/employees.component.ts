import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // 🔹 Pagination Variables
  currentPage: number = 0;
  pageSize: number = 10;
  totalEmployees: number = 0;

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  position: string = '';


  get isAdmin(): boolean {
    return <boolean>this.authService.getUserPermissions()?.includes('admin');
  }

  ngOnInit(): void {
    if (!this.isAdmin) {
      this.errorMessage = "You are not authorized to view this page.";
      return;
    }

    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees(this.currentPage, this.pageSize, this.firstName, this.lastName, this.email, this.position).subscribe({
      next: (response) => {
        this.employees = response.content;
        this.totalEmployees = response.totalElements;
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Failed to load employees. Please try again later.';
        this.employees = [];
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadEmployees();
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalEmployees) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEmployees();
    }
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
          this.loadEmployees(); // Reload after delete
          this.closeDeleteModal();
        },
        error: () => {
          this.errorMessage = 'Failed to delete employee. Please try again.';
        }
      });
    }
  }

  register() {
    this.router.navigate(['/register-employee']);
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
      error: (error) => {
        console.error("❌ Error deactivating employee:", error);
        this.errorMessage = 'Failed to deactivate employee. Please try again.';
      }
    });
  }


  viewEmployeeDetails(id: number): void {
    this.router.navigate(['/employees', id]);
  }
}

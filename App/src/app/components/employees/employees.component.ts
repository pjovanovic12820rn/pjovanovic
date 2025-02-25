import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  employees: Employee[] = [];
  errorMessage: string | null = null;
  showDeleteModal = false;
  selectedEmployee: Employee | null = null;
  isDeleteButtonClickable: boolean = true; //bris?
  errorMessageDelete: string | null = null;
  countdown: number | null = null;
  get isAdmin(): boolean {
    return this.employeeService.isAdmin;
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.errorMessage = 'Failed to load employees. Please try again later.';
        this.employees = [];
      }
    });
  }

  //za brisanje
  openDeleteModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showDeleteModal = true;
    //za cntd
    this.isDeleteButtonClickable = true;
    this.countdown = null;
    this.errorMessageDelete = null;
  }
  closeDeleteModal(): void {
    this.selectedEmployee = null;
    this.showDeleteModal = false;
    //za cntd
    this.countdown = null;
    this.errorMessageDelete = null;
    this.isDeleteButtonClickable = true;
  }

  confirmDelete(): void {
    if (!this.isAdmin) {
      this.errorMessage = "You are not authorized to delete employees.";
      this.isDeleteButtonClickable = false;
      this.errorMessageDelete = "You are not authorized to delete employees.";
      this.startCountdown();
      // this.closeDeleteModal();
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
          this.closeDeleteModal();
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
          employee.isActive = false;
        }
      },
      error: (error) => {
        console.error('Error deactivating employee:', error);
        this.errorMessage = 'Failed to deactivate employee. Please try again.';
      }
    });
  }

  startCountdown(): void {
    this.countdown = 3;

    const interval = setInterval(() => {
      if (this.countdown !== null && this.countdown > 0) {
        this.countdown -= 1;
      } else {
        clearInterval(interval);
        this.closeDeleteModal();
      }
    }, 1000);
  }

}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);

  employee: Employee | null = null;
  errorMessage: string | null = null;

  get isAdmin(): boolean {
    return <boolean>this.authService.getUserPermissions()?.includes("admin");
  }

  ngOnInit(): void {
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.employeeService.getEmployeeSelf().subscribe({
      next: (fetchedEmployee) => {
        if (!fetchedEmployee) {
          this.errorMessage = 'Employee not found.';
          this.router.navigate(['/']);
          return;
        }
        this.employee = fetchedEmployee;
      },
      error: () => {
        this.errorMessage = 'Failed to load employee details. Please try again later.';
      }
    });
  }
}

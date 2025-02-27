import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);

  employee: Employee | null = null;
  errorMessage: string | null = null;

  get isAdmin(): boolean {
    return this.authService.getUserPermissions() === 'admin';
  }

  ngOnInit(): void {
    let employeeId: number | null = null;
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      employeeId = Number(idParam);
      if (isNaN(employeeId)) {
        this.errorMessage = 'Invalid employee ID.';
        return;
      }
    }

    if (employeeId !== null) {
      this.loadEmployee(employeeId);
    } else {
      this.errorMessage = 'No employee information available.';
    }
  }

  loadEmployee(employeeId: number): void {
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (fetchedEmployee) => {
        if (!fetchedEmployee) {
          this.errorMessage = 'Employee not found.';
          this.router.navigate(['/employees']); // Redirect if employee not found
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

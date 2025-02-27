import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmployeesComponent } from './employees.component';
import { EmployeeService } from '../../services/employee.service';
import { of, throwError } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLink } from '@angular/router';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;
  let employeeServiceMock: jasmine.SpyObj<EmployeeService>;

  const mockEmployees: Employee[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-05-20'),
      gender: 'M',
      email: 'john.doe@example.com',
      phone: '+381645555555',
      address: 'Njegoseva 25',
      username: 'john90',
      position: 'Manager',
      department: 'Finance',
      active: true,
      jmbg: '1234567890123'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      birthDate: new Date('1992-08-15'),
      gender: 'F',
      email: 'jane.doe@example.com',
      phone: '+381645555556',
      address: 'Some Other Street 10',
      username: 'jane92',
      position: 'Software Engineer',
      department: 'IT',
      active: true,
      jmbg: '9876543210987'
    }
  ];

  beforeEach(async () => {
    employeeServiceMock = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'isAdmin']);
    employeeServiceMock.isAdmin = true;

    await TestBed.configureTestingModule({
      imports: [EmployeesComponent, CommonModule, RouterTestingModule],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch employees on init if user is admin', fakeAsync(() => {
    employeeServiceMock.getEmployees.and.returnValue(of(mockEmployees));
    fixture.detectChanges();
    tick();
    expect(employeeServiceMock.getEmployees).toHaveBeenCalled();
    expect(component.employees).toEqual(mockEmployees);
    expect(component.errorMessage).toBeNull();
  }));

  it('should handle error when fetching employees', fakeAsync(() => {
    employeeServiceMock.getEmployees.and.returnValue(throwError(() => new Error('Test Error')));
    fixture.detectChanges();
    tick();
    expect(employeeServiceMock.getEmployees).toHaveBeenCalled();
    expect(component.employees).toEqual([]);
    expect(component.errorMessage).toBe('Failed to load employees. Please try again later.');
  }));

  it('should display employee list if user is admin', fakeAsync(() => {
    employeeServiceMock.getEmployees.and.returnValue(of(mockEmployees));
    fixture.detectChanges();
    tick();
    const employeeCards = fixture.nativeElement.querySelectorAll('.employee-card');
    expect(employeeCards.length).toBe(mockEmployees.length);
  }));

  it('should display "No employees found." if no employees and user is admin', fakeAsync(() => {
    employeeServiceMock.getEmployees.and.returnValue(of([]));
    fixture.detectChanges();
    tick();
    const noEmployeesMessage = fixture.nativeElement.querySelector('p');
    expect(noEmployeesMessage.textContent).toContain('No employees found.');
  }));

});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditEmployeeComponent } from './edit-employee.component';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';

describe('EditEmployeeComponent', () => {
  let component: EditEmployeeComponent;
  let fixture: ComponentFixture<EditEmployeeComponent>;
  let employeeServiceMock: jasmine.SpyObj<EmployeeService>;
  let activatedRouteMock: any;
  let fb: FormBuilder;

  const mockEmployee: Employee = {
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
  };

  beforeEach(async () => {
    employeeServiceMock = jasmine.createSpyObj('EmployeeService', ['getEmployee']);
    activatedRouteMock = {
      paramMap: of(new Map([['id', '1']]))
    };
    fb = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [EditEmployeeComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: FormBuilder, useValue: fb }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmployeeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch employee on init', fakeAsync(() => {
    employeeServiceMock.getEmployee.and.returnValue(of(mockEmployee));
    fixture.detectChanges();
    tick();
    expect(employeeServiceMock.getEmployee).toHaveBeenCalledWith(1);
    expect(component.employee).toEqual(mockEmployee);
    expect(component.editForm).toBeDefined();
    expect(component.errorMessage).toBeNull();
  }));

  it('should handle invalid employee ID', fakeAsync(() => {
    activatedRouteMock.paramMap = of(new Map([['id', 'abc']]));
    fixture.detectChanges();
    tick();
    expect(employeeServiceMock.getEmployee).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Invalid employee ID.');
  }));

  it('should handle employee not found', fakeAsync(() => {
    employeeServiceMock.getEmployee.and.returnValue(of(undefined));
    fixture.detectChanges();
    tick();
    expect(component.errorMessage).toBe('Employee not found.');
    expect(component.employee).toBeUndefined();
  }));

  it('should handle error fetching employee', fakeAsync(() => {
    employeeServiceMock.getEmployee.and.returnValue(throwError(() => new Error('Test Error')));
    fixture.detectChanges();
    tick();
    expect(component.errorMessage).toBe('Failed to load employee details. Please try again later.');
  }));

  it('should initialize form with employee data', fakeAsync(() => {
    employeeServiceMock.getEmployee.and.returnValue(of(mockEmployee));
    fixture.detectChanges();
    tick();
    expect(component.editForm.value).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-05-20',
      gender: 'M',
      email: 'john.doe@example.com',
      phone: '+381645555555',
      address: 'Njegoseva 25',
      position: 'Manager',
      department: 'Finance',
      isActive: true
    });
  }));

  it('should submit form if valid', () => {
    employeeServiceMock.getEmployee.and.returnValue(of(mockEmployee));
    fixture.detectChanges();

    spyOn(console, 'log');

    component.editForm.patchValue({
        firstName: 'Updated John',
        lastName: 'Updated Doe',
        birthDate: '1991-06-21',
        gender: 'F',
        email: 'updated.john.doe@example.com',
        phone: '+987654321',
        address: 'Updated Address 26',
        position: 'Updated Position',
        department: 'Updated Department',
        isActive: false
    });

    component.onSubmit();
    expect(console.log).toHaveBeenCalledWith('Form submitted:', {
        firstName: 'Updated John',
        lastName: 'Updated Doe',
        birthDate: new Date('1991-06-21T00:00:00.000Z'),
        gender: 'F',
        email: 'updated.john.doe@example.com',
        phone: '+987654321',
        address: 'Updated Address 26',
        position: 'Updated Position',
        department: 'Updated Department',
        isActive: false
    });
  });

  it('should not submit form if invalid', () => {
    employeeServiceMock.getEmployee.and.returnValue(of(mockEmployee));
    fixture.detectChanges();

    spyOn(console, 'log');
    component.editForm.controls['firstName'].setValue('');
    component.onSubmit();
    expect(console.log).toHaveBeenCalledWith('Form is invalid');
    expect(component.editForm.valid).toBeFalse();
  });

});

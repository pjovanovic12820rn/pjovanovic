
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private mockUsers: User[] = [
    {
      id: 101,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      phone: '+381643211234',
      address: 'Some Street 1',
      isActive: true,
    },
    {
      id: 102,
      firstName: 'Bob',
      lastName: 'Miller',
      email: 'bob.miller@example.com',
      phone: '+381643211235',
      address: 'Another Street 2',
      isActive: false,
    },
  ];

  constructor(private authService: AuthService) {}

  getUsers(): Observable<User[]> {
    
    return of(this.mockUsers);
  }

  getUser(id: number): Observable<User | undefined> {
    
    const user = this.mockUsers.find((u) => u.id === id);
    return of(user);
  }

  updateUser(updatedUser: User): Observable<boolean> {
   
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }

    const index = this.mockUsers.findIndex((u) => u.id === updatedUser.id);
    if (index === -1) {
      return throwError(() => new Error('User not found.'));
    }
    this.mockUsers[index] = { ...updatedUser };
    return of(true);
  }

  deleteUser(id: number): Observable<boolean> {

    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }

    const index = this.mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      return throwError(() => new Error('User not found.'));
    }
    this.mockUsers.splice(index, 1);
    return of(true);
  }
}

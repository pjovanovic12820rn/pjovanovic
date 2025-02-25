import { Injectable } from '@angular/core';
import { Employee, Message } from '../models/employee.model';
import {Observable, of, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAdmin = false;


  resetPassword(token: string, newPassword: string): Observable<Message>{
    const message: Message = {
      message: "Password reset successfully"
    };
    return of(message);
  }



}

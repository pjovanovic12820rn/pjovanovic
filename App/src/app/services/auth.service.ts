import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import {Observable, of, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAdmin = false;


}

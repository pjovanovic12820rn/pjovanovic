import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  createAccount(accountData: any): Observable<any> {
    console.log('Account data to be sent to backend:', accountData);
    return of({ message: 'Account created successfully (mock)' }); // Mock success response
  }
}
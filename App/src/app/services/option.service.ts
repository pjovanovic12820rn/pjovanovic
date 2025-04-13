import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Option } from '../models/option.model';
import { AuthService } from './auth.service';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OptionService {
  private apiUrl = `${environment.stockUrl}/api/listings`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Authentication token is missing.");
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getStockOptionsByDate(stockId: number, date: Date): Observable<Option[]> {
    const formattedDate = this.formatDateToYYYYMMDD(date);
    const url = `${this.apiUrl}/${stockId}/options/${formattedDate}`;
    return this.http
      .get<Option[]>(url, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error(
            `Error fetching options for stock ${stockId} and date ${formattedDate}:`,
            error
          );
          return of([]);
        })
      );
  }

  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

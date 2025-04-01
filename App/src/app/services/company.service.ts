import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company, CreateCompany } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8080/api/company';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createCompany(companyData: CreateCompany): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, companyData, {
      headers: this.getAuthHeaders()
    });
  }

  getCompaniesByClientId(clientId: number): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/owned-by/${clientId}`, {
      headers: this.getAuthHeaders()
    });
  }

}

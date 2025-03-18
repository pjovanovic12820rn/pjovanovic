import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {delay, Observable, of} from 'rxjs';
import { AuthService } from './auth.service';
import { Company, CreateCompany } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8080/api/company';

  // todo tmp mock data
  private mockCompanies: Company[] = [
    {
      id: 1,
      name: 'Mock Company 1',
      registrationNumber: '123456',
      taxId: 'TAX001',
      activityCode: '10.01',
      address: 'Mock Address 1',
      majorityOwner: 1
    },
    {
      id: 2,
      name: 'Mock Company 2',
      registrationNumber: '789012',
      taxId: 'TAX002',
      activityCode: '10.01',
      address: 'Mock Address 2',
      majorityOwner: 1
    }
  ];

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

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  //todo change mock when poss
  getCompaniesByClientId(clientId: number): Observable<Company[]> {
    console.log('Using mock companies data');
    const filteredCompanies = this.mockCompanies.filter(
      company => company.majorityOwner === clientId
    );
    // neka rand sim backa
    return of(filteredCompanies).pipe(delay(500));
  }

}

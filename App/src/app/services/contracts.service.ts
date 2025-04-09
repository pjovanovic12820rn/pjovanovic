import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettledContractDto } from '../models/settled-contract-dto';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  constructor(private http: HttpClient) {}

  getSettledContracts(): Observable<SettledContractDto[]> {
    return this.http.get<SettledContractDto[]>('/api/contracts/settled');
  }

  exerciseContract(contractId: number): Observable<void> {
    return this.http.put<void>(`/api/contracts/${contractId}/exercise`, {});
  }
}

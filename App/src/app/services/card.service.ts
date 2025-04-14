import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'
import {environment} from '../environments/environment';

export interface Card {
  cardNumber: string
  status: string
  owner: {
    firstName: string
    lastName: string
    email: string
  }
}

export interface CreateCardDto {
  accountNumber: string
  type: string
  issuer: string
  name: string
  cardLimit: number
  authorizedPersonId?: number
}

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = `${environment.bankUrl}/api/account`
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken()
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    })
  }

  // admin
  getCardsByAccount(accountNumber: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/${accountNumber}/cards`, {headers: this.getAuthHeaders()})
  }

  // client
  getMyCardsForAccount(accountNumber: string): Observable<Card[]> {
    // return this.http.get<Card[]>(`${this.apiUrl}/${accountNumber}/cards/my-cards`, { headers: this.getAuthHeaders() })
    return this.http.get<Card[]>(`${this.apiUrl}/${accountNumber}/cards/my-account-cards`, {
      headers: this.getAuthHeaders()
    });
  }

  blockCardByUser(accountNumber: string, cardNumber: string): Observable<any> {
    const url = `${this.apiUrl}/${accountNumber}/cards/${cardNumber}/block-by-user`
    return this.http.post(url, {}, { headers: this.getAuthHeaders() })
  }

  blockCardByAdmin(accountNumber: string, cardNumber: string): Observable<any> {
    const url = `${this.apiUrl}/${accountNumber}/cards/${cardNumber}/block`
    return this.http.post(url, {}, { headers: this.getAuthHeaders() })
  }

  unblockCard(accountNumber: string, cardNumber: string): Observable<any> {
    const url = `${this.apiUrl}/${accountNumber}/cards/${cardNumber}/unblock`
    return this.http.post(url, {}, { headers: this.getAuthHeaders() })
  }

  deactivateCard(accountNumber: string, cardNumber: string): Observable<any> {
    const url = `${this.apiUrl}/${accountNumber}/cards/${cardNumber}/deactivate`
    return this.http.post(url, {}, { headers: this.getAuthHeaders() })
  }

  createCard(dto: CreateCardDto): Observable<any> {
    console.log(dto)
    const url = `${this.apiUrl}/${dto.accountNumber}/cards/create`
    return this.http.post(url, dto, { headers: this.getAuthHeaders() })
  }

  requestCard(dto: CreateCardDto): Observable<any> {
    const url = `${this.apiUrl}/${dto.accountNumber}/cards/request`
    return this.http.post(url, dto, { headers: this.getAuthHeaders(), responseType: 'text' })
  }
}

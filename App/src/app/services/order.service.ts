import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map, Observable, take} from 'rxjs';
import {Order, PageResponse} from '../models/order.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Ako koristiš environment varijablu, ovde se može postaviti npr. environment.apiUrl + '/api/orders'
  private baseUrl = 'http://localhost:8083/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Metoda koja vraća potrebne HTTP zaglavlja sa JWT tokenom
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // pretpostavljamo da AuthService ima metodu getToken()
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // getOrders(status: string): Observable<Order[]> {
  //   let url = this.baseUrl;
  //   if (status && status !== 'All') {
  //     url += `?status=${status}`;
  //   }
  //   return this.http.get<Order[]>(url, { headers: this.getAuthHeaders() });
  // }
  getOrders(status: string): Observable<PageResponse<Order>> {
    return this.http.get<PageResponse<Order>>(this.baseUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      take(1),
      map((response) => {
        if (status && status !== 'ALL') {
          return {
            ...response,
            content: response.content.filter(order => order.status === status)
          };
        }
        return response;
      })
    );
  }

  approveOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${orderId}/approve`, {}, { headers: this.getAuthHeaders() });
  }

  declineOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${orderId}/decline`, {}, { headers: this.getAuthHeaders() });
  }

  cancelOrder(orderId: number, cancelQuantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${orderId}/cancel`, { cancelQuantity }, { headers: this.getAuthHeaders() });
  }
}

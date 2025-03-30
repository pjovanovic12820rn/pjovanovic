import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {map, Observable, take} from 'rxjs';
import {Order, PageResponse} from '../models/order.model';
import { AuthService } from './auth.service';
import { CreateOrderDto } from '../models/create-order.dto';
import { OrderDto } from '../models/order.dto';

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

    if (!token) {
      throw new Error('Authorization token is missing');
    }

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
  getOrders(status: string, page: number = 0, size: number = 10): Observable<PageResponse<OrderDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status && status !== 'ALL') {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse<OrderDto>>(this.baseUrl, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  createOrder(orderData: CreateOrderDto): Observable<OrderDto> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    const payload: any = {
        ...orderData,
        limitValue: orderData.limitValue !== undefined && orderData.limitValue !== null ? orderData.limitValue : null,
        stopValue: orderData.stopValue !== undefined && orderData.stopValue !== null ? orderData.stopValue : null
    };


    return this.http.post<OrderDto>(`${this.baseUrl}`, payload, { headers });
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

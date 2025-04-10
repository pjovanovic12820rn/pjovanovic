import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map, Observable, take} from 'rxjs';
import {Order, PageResponse} from '../models/order.model';
import { AuthService } from './auth.service';
import {MakeOrderDto} from '../models/make-order-dto';

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
  // znaci trebala bi metoda da bude kao sto je ovo zakomentarisano 90% , ovo je Milan dodao radi sell-a iz portfolia!
  // makeOrder(listingId: number, orderType: OrderType, quantity: number, contractSize: number, orderDirections: OrderDirection, accountNumber: string,){
  makeOrder(listingId: number, quantity: number, contractSize: number, accountNumber: string,action: string,orderTypeStr: string): Observable<any>{
    const orderBody : MakeOrderDto = {
      listingId: listingId,
      orderType: orderTypeStr,
      quantity: quantity,// zakucano za sad ne znam koje je pravilo!
      contractSize: contractSize,
      orderDirection: action, // ovo je okej da bude zakucano!
      accountNumber: accountNumber
    };

    console.log(orderBody.listingId + orderBody.orderType + orderBody.quantity + orderBody.contractSize + orderBody.orderDirection + orderBody.accountNumber + "result was this");

    return this.http.post<void>(this.baseUrl, orderBody, { headers: this.getAuthHeaders() });

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
enum OrderType{
  MARKET, LIMIT, STOP, STOP_LIMIT
}

enum OrderDirection{
  BUY, SELL
}

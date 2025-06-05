import {Component, inject, OnInit} from '@angular/core';
import {AlertService} from '../../../services/alert.service';
import {AuthService} from '../../../services/auth.service';
import {AccountService} from '../../../services/account.service';
import {OrderService} from '../../../services/order.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import {ButtonComponent} from '../../shared/button/button.component';
import {ModalComponent} from '../../shared/modal/modal.component';
import {InputTextComponent} from '../../shared/input-text/input-text.component';
import {OrderRealDto} from '../../../models/order-real-dto';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [FormsModule,
    NgIf,
    NgForOf,
    ButtonComponent,
    ButtonComponent,
    PaginationComponent
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent  implements OnInit{

  currentPage = 1;
  pageSize = 10;

  private alertService = inject(AlertService);
  private authService= inject(AuthService);
  private accountService= inject(AccountService);
  private orderService = inject(OrderService);


  myOrders: OrderRealDto[] = [];
  pagedOrders: OrderRealDto[] = [];
  userId: number | null = 0;


  ngOnInit(): void {

    this.getMyUserId();

    if(this.userId != null) {
      this.loadMyOrders(this.userId);
    }
  }

  updatePagedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedOrders = this.myOrders.slice(startIndex, endIndex);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.updatePagedOrders();
  }

  getMyUserId(){
    if (this.authService.getUserId() != null) {
      this.userId = this.authService.getUserId();
    }
  }

  loadMyOrders(userId: number): void {

    this.orderService.getOrdersByUser(userId).subscribe({
      next: (data) => {
        this.myOrders = data;
        this.updatePagedOrders();
      },
      error: (err) => {
        this.alertService.showAlert("error","Failed to load my orders!");
      }
    });
  }


  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe({
      next: (data) => {
        this.alertService.showAlert("success","Successfully canceled order!");
        if(this.userId != null) {
          this.loadMyOrders(this.userId);
        }
      },
      error: (err) => {
        this.alertService.showAlert("error","Failed to cancel the order!");
      }
    });
  }

}

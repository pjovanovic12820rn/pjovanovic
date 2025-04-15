import {Component, inject, OnInit} from '@angular/core';
import {AlertService} from '../../../services/alert.service';
import {AuthService} from '../../../services/auth.service';
import {AccountService} from '../../../services/account.service';
import {OrderService} from '../../../services/order.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {OrderCreationModalComponent} from '../../shared/order-creation-modal/order-creation-modal.component';
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
    ButtonComponent
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent  implements OnInit{

  private alertService = inject(AlertService);
  private authService= inject(AuthService);
  private accountService= inject(AccountService);
  private orderService = inject(OrderService);


  myOrders: OrderRealDto[] = [];
  userId: number | null = 0;


  ngOnInit(): void {

    this.getMyUserId();

    if(this.userId != null) {
      this.loadMyOrders(this.userId);
    }
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

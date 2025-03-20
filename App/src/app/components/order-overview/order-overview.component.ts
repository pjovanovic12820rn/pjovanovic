import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model'; 

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.css']
})
export class OrderOverviewComponent implements OnInit {
  orders: Order[] = [];
  filterStatus: string = 'All';
  cancelQuantity: { [orderId: number]: number } = {};

  constructor(private orderService: OrderService, public authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      alert("Access denied. Only supervisors can access this portal.");
      return;
    }
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders(this.filterStatus).subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Error fetching orders', err)
    });
  }

  onFilterChange(): void {
    this.loadOrders();
  }

  approveOrder(order: Order): void {
    this.orderService.approveOrder(order.id).subscribe({
      next: () => {
        alert(`Order ${order.id} approved`);
        this.loadOrders();
      },
      error: (err) => console.error('Error approving order', err)
    });
  }

  declineOrder(order: Order): void {
    this.orderService.declineOrder(order.id).subscribe({
      next: () => {
        alert(`Order ${order.id} declined`);
        this.loadOrders();
      },
      error: (err) => console.error('Error declining order', err)
    });
  }

  cancelOrder(order: Order): void {
    const quantity = this.cancelQuantity[order.id] || order.remainingPortions;
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to cancel orders.');
      return;
    }
    this.orderService.cancelOrder(order.id, quantity).subscribe({
      next: () => {
        alert(`Order ${order.id} cancelled for quantity: ${quantity}`);
        this.loadOrders();
      },
      error: (err) => console.error('Error cancelling order', err)
    });
  }

  isOrderExpired(order: Order): boolean {
    if (!order.isTimeLimited) return false;
    const orderDate = new Date(order.orderDate);
    const now = new Date();
    return now > orderDate;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { Order, PageResponse } from '../../../models/order.model';
import { OrderDto } from '../../../models/order.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  styleUrls: ['./order-overview.component.css'],
})
export class OrderOverviewComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filterStatus: string = 'ALL';
  loading: boolean = false;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();

  currentPage = 1;
  pageSize = 10;
  pagedOrders: Order[] = [];

  constructor(
    private orderService: OrderService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isSupervisor() && !this.authService.isAdmin()) {
      this.errorMessage =
        'Access denied. Only supervisors can access this portal.';
      return;
    }
    this.loadOrders();
  }

  updatePagedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedOrders = this.orders.slice(startIndex, endIndex);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.updatePagedOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService
      .getOrders(this.filterStatus)
      .pipe(
        takeUntil(this.destroy$),
        map((pageDto: PageResponse<OrderDto>): PageResponse<Order> => {
          const transformedContent = pageDto.content.map(
            (dto: OrderDto): Order => {
              return {
                id: dto.id,
                clientName: dto.clientName,
                listing: dto.listing,
                orderType: dto.orderType,
                quantity: dto.quantity,
                pricePerUnit: dto.pricePerUnit ?? 0,
                direction: dto.direction,
                status: dto.status,
                approvedBy: dto.approvedBy,
                isDone: dto.isDone,
                lastModification: dto.lastModification,
                orderDate: dto.orderDate,
                remainingPortions: dto.remainingPortions,
                afterHours: dto.afterHours,
                accountNumber: dto.accountNumber,
              };
            }
          );
          return {
            ...pageDto,
            content: transformedContent,
          };
        })
      )
      .subscribe({
        next: (page: PageResponse<Order>) => {
          console.log('orders', page);
          this.orders = page.content;
          this.loading = false;
          this.updatePagedOrders();
        },
        error: (err) => {
          console.error('Error fetching orders', err);
          this.errorMessage = 'Failed to load orders. Please try again later.';
          this.loading = false;
        },
      });
  }

  onFilterChange(): void {
    this.loadOrders();
  }

  approveOrder(order: Order): void {
    this.orderService
      .approveOrder(order.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess(`Order ${order.id} approved`),
        error: (err) => this.handleError('approving order', err),
      });
  }

  declineOrder(order: Order): void {
    // Added implementation
    this.orderService
      .declineOrder(order.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess(`Order ${order.id} declined`),
        error: (err) => this.handleError('declining order', err),
      });
  }

  private handleSuccess(message: string): void {
    alert(message);
    this.loadOrders();
  }

  private handleError(action: string, error: any): void {
    console.error(`Error ${action}`, error);
    this.errorMessage = `Error ${action}. Please try again.`;
  }

  // isOrderExpired(order: Order): boolean {
  //   if (!order.isTimeLimited) return false;
  //   const orderDate = new Date(order.orderDate).getTime();
  //   return Date.now() > orderDate;
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

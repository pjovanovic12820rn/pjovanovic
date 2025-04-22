import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityService } from '../../../services/security.service';
import { Security } from '../../../models/security.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { OrderCreationModalComponent } from '../../shared/order-creation-modal/order-creation-modal.component';
import { AlertService } from '../../../services/alert.service';
import {ButtonComponent} from '../../shared/button/button.component';

@Component({
  selector: 'app-securities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    OrderCreationModalComponent,
    ButtonComponent
  ],
  templateUrl: './securities.component.html',
  styleUrl: './securities.component.css'
})
export class SecuritiesComponent implements OnInit {
  private securityService = inject(SecurityService);
  protected authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private allSecurities: Security[] = [];
  securities: Security[] = [];
  searchTerm: string = '';
  selectedSecurityType: 'All' | 'Stock' | 'Future' | 'Forex' = 'All';
  sortOrder: 'asc' | 'desc' | null = null;
  sortBy: 'price' | 'volume' | 'maintenanceMargin' | null = null;

  priceRange: { min: number | null, max: number | null } = { min: null, max: null };
  volumeRange: { min: number | null, max: number | null } = { min: null, max: null };
  marginRange: { min: number | null, max: number | null } = { min: null, max: null };
  exchangePrefix: string = '';
  settlementDateFilter: string = '';


  isOrderModalOpen = false;
  selectedSecurityForOrder: Security | null = null;
  orderDirection: 'BUY' | 'SELL' = 'BUY';

  isLoading = false;

  ngOnInit(): void {
    this.loadSecurities();
  }


  closeOrderModal(): void {
    this.isOrderModalOpen = false;
    this.selectedSecurityForOrder = null;
  }

  handleOrderCreation(orderDetails: any): void {
    this.closeOrderModal();
  }

  refreshAllSecurities(): void {
    this.isLoading = true;
    this.securityService.getSecurities().subscribe({
        next: securities => {
            this.allSecurities = securities;
            this.applyFiltersAndSort();
            this.isLoading = false;
            this.alertService.showAlert('success', 'Securities list refreshed.');
        },
        error: err => {
            console.error("Error refreshing securities:", err);
            this.alertService.showAlert('error', 'Failed to refresh securities list.');
            this.isLoading = false;
        }
    });
  }

  private loadSecurities(): void {
    this.isLoading = true;
    this.securityService.getSecurities().subscribe({
        next: securities => {
            this.allSecurities = securities;
            this.applyFiltersAndSort();
            this.isLoading = false;
        },
        error: err => {
            console.error("Error loading securities:", err);
            this.alertService.showAlert('error', 'Failed to load securities list.');
            this.isLoading = false;
        }
    });
  }

  protected testMode(): void {
    this.securityService.getSecurities().subscribe({
      next: res => {
        this.alertService.showAlert('success', 'Successfully toggled test market mode')
      },
      error: err => {
        console.error("Error toggling test market mode:", err);
        this.alertService.showAlert('error', 'Failed to toggle test market mode');
        this.isLoading = false;
      }
    });
  }

  private applyFiltersAndSort(): void {
    this.filterSecurities();
    this.sortSecurities();
  }

  onSearch(): void {
    this.applyFiltersAndSort();
  }

  onSelectSecurityType(type: 'All' | 'Stock' | 'Future' | 'Forex'): void {
    this.selectedSecurityType = type;
    this.applyFiltersAndSort();
  }

  onSort(): void {
    if (this.sortBy === 'price') {
      if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc';
      } else {
        this.sortBy = 'volume';
        this.sortOrder = 'asc';
      }
    } else if (this.sortBy === 'volume') {
      if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc';
      } else {
        this.sortBy = 'maintenanceMargin';
        this.sortOrder = 'asc';
      }
    } else if (this.sortBy === 'maintenanceMargin') {
      if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc';
      } else {
        this.sortBy = null;
        this.sortOrder = null;
      }
    }
    else {
      this.sortBy = 'price';
      this.sortOrder = 'asc';
    }
    this.sortSecurities();
  }

  onRangeFilterChange(): void {
    this.applyFiltersAndSort();
  }

  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  private sortSecurities(): void {
    if (this.sortBy && this.sortOrder) {
      this.securities.sort((a, b) => {
        let valueA, valueB;

        switch (this.sortBy) {
          case 'price':
            valueA = a.price;
            valueB = b.price;
            break;
          case 'volume':
            valueA = a.volume;
            valueB = b.volume;
            break;
          case 'maintenanceMargin':
            valueA = a.maintenanceMargin;
            valueB = b.maintenanceMargin;
            break;
          default:
            return 0;
        }

        valueA = valueA ?? 0;
        valueB = valueB ?? 0;
        return this.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      });
    }
  }

  private filterSecurities(): void {
    let tempFilteredSecurities = [...this.allSecurities];

    if (this.selectedSecurityType !== 'All') {
      tempFilteredSecurities = tempFilteredSecurities.filter(security => security.type === this.selectedSecurityType);
    }

    const term = this.searchTerm.toLowerCase();
    if (term) {
      tempFilteredSecurities = tempFilteredSecurities.filter(security =>
        security.ticker.toLowerCase().includes(term)
      );
    }

    tempFilteredSecurities = tempFilteredSecurities.filter(security =>
      this.checkRange(security.price, this.priceRange) &&
      this.checkRange(security.volume, this.volumeRange) &&
      this.checkRange(security.maintenanceMargin, this.marginRange)
    );

    if (this.exchangePrefix) {
      tempFilteredSecurities = tempFilteredSecurities.filter(security =>
        security.ticker.toLowerCase().startsWith(this.exchangePrefix.toLowerCase())
      );
    }

    if (this.settlementDateFilter) {
        tempFilteredSecurities = tempFilteredSecurities.filter(security => {
            if (security.type === 'Future') {
                return security.settlementDate?.includes(this.settlementDateFilter) ?? false;
            }
            return true;
        });
    }

    this.securities = tempFilteredSecurities;
  }
  private checkRange(value: number | undefined | null, range: { min: number | null, max: number | null }): boolean {
    if (value === null || value === undefined) return true;
    const min = range.min;
    const max = range.max;
    if (min != null && value < min) return false;
    if (max != null && value > max) return false;
    return true;
  }

  openBuyOrderModal(security: Security): void {
    this.selectedSecurityForOrder = security;
    this.orderDirection = 'BUY';
    this.isOrderModalOpen = true;
  }

  get currentSecurityPrice(): number {
    return this.selectedSecurityForOrder?.price ?? 0;
  }

  get currentContractSize(): number {
     return 1;
  }

  get currentListingId(): number | null {
    return this.selectedSecurityForOrder?.id ?? null;
  }
}

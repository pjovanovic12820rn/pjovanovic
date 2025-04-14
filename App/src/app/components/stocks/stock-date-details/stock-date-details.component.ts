import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OptionService } from '../../../services/option.service';
import { SecurityService } from '../../../services/security.service';
import { AlertService } from '../../../services/alert.service';
import { Option } from '../../../models/option.model';
import { OrderCreationModalComponent } from '../../shared/order-creation-modal/order-creation-modal.component';
import { catchError, forkJoin, map, switchMap, tap, throwError } from 'rxjs';
import { ButtonComponent } from '../../shared/button/button.component';

interface GroupedOption {
  strike: number;
  call?: Option;
  put?: Option;
}

@Component({
  selector: 'app-stock-date-details',
  standalone: true,
  imports: [
    CommonModule,
    OrderCreationModalComponent,
    DatePipe,
    ButtonComponent
  ],
  templateUrl: './stock-date-details.component.html',
  styleUrls: ['./stock-date-details.component.css']
})
export class StockDateDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private optionService = inject(OptionService);
  private securityService = inject(SecurityService);
  private alertService = inject(AlertService);

  options = signal<Option[] | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  stockId = signal<number | null>(null);
  selectedDate = signal<string | null>(null);
  stockTicker = signal<string>('');

  // modal rel
  isOrderModalOpen = signal(false);
  selectedOptionForOrder = signal<Option | null>(null);

  // grupisane opcije
  groupedOptions = signal<GroupedOption[]>([]);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.isLoading.set(true);
          this.errorMessage.set(null);
          this.options.set(null);
          this.stockId.set(null);
          this.selectedDate.set(null);
          this.stockTicker.set('');
          this.groupedOptions.set([]);
        }),
        map(params => {
          const idParam = params.get('id');
          const dateParam = params.get('date');
          if (!idParam) throw new Error('Stock ID not found.');
          if (!dateParam) throw new Error('Date not found.');
          const id = parseInt(idParam, 10);
          if (isNaN(id)) throw new Error('Invalid Stock ID format.');
          if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam))
            throw new Error('Invalid Date format.');
          const dateObject = new Date(dateParam + 'T00:00:00');
          if (isNaN(dateObject.getTime()))
            throw new Error('Invalid Date value.');

          this.stockId.set(id);
          this.selectedDate.set(dateParam);

          return { id, dateObject };
        }),
        switchMap(({ id, dateObject }) => {
          const details$ = this.securityService.getListingDetails(id).pipe(
            catchError(err => {
              console.error('Error fetching listing details:', err);
              return throwError(() => new Error('Failed to load stock details.'));
            })
          );
          const options$ = this.optionService.getStockOptionsByDate(id, dateObject).pipe(
            catchError(err => {
              console.error('Error fetching options:', err);
              return throwError(() => new Error('Failed to load options data.'));
            })
          );
          return forkJoin({ details: details$, options: options$ });
        }),
        catchError(err => {
          console.error('StockDateDetails: Error in forkJoin or upstream:', err);
          this.errorMessage.set(err?.message || 'An error occurred while loading data.');
          this.isLoading.set(false);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: ({ details, options }) => {
          this.stockTicker.set(details.ticker);
          this.options.set(options);
          this.isLoading.set(false);

          this.createGroupedOptions(options);
        },
        error: err => {
          if (this.isLoading()) {
            this.isLoading.set(false);
          }
        }
      });
  }

  /**
   * Groups options by strike price.
   * Each group will contain a call and/or put Option (if available).
   */
  private createGroupedOptions(options: Option[]): void {
    const mapByStrike = new Map<number, GroupedOption>();

    for (const opt of options) {
      const strike = opt.strikePrice;
      if (!mapByStrike.has(strike)) {
        mapByStrike.set(strike, { strike });
      }

      const grouped = mapByStrike.get(strike)!;

      if (opt.optionType === 'CALL') {
        grouped.call = opt;
      } else if (opt.optionType === 'PUT') {
        grouped.put = opt;
      }
    }

    const groupedArray = Array.from(mapByStrike.values()).sort(
      (a, b) => a.strike - b.strike
    );

    this.groupedOptions.set(groupedArray);
  }

  // modal delovi

  openBuyOptionModal(option: Option): void {
    this.selectedOptionForOrder.set(option);
    this.isOrderModalOpen.set(true);
  }

  closeOrderModal(): void {
    this.isOrderModalOpen.set(false);
    this.selectedOptionForOrder.set(null);
  }

  handleOrderCreation(event: any): void {
    if (event?.success) {
      this.alertService.showAlert('success', 'Option order placed successfully!');
    }
    this.closeOrderModal();
  }

  get modalSecurityTicker(): string {
    const option = this.selectedOptionForOrder();
    const ticker = this.stockTicker() || 'STOCK';
    if (!option) return '';
    return `${option.optionType || '?'} ${ticker} @ ${option.strikePrice} Exp ${this.selectedDate() || '?'
    }`;
  }

  get modalSecurityPrice(): number {
    return this.selectedOptionForOrder()?.price ?? 0;
  }

  get modalContractSize(): number {
    return 100;
  }

  get modalListingId(): number | null {
    return this.stockId();
  }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SecurityService } from '../../../services/security.service';
import { ListingDetailsDto } from '../../../models/listing-details.dto';
import { ListingType } from '../../../enums/listing-type.enum';
import { catchError, map, switchMap, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private securityService = inject(SecurityService);

  listingDetails = signal<ListingDetailsDto | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  stockId = signal<number | null>(null);
  ListingType = ListingType;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(() => {
        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.listingDetails.set(null);
        this.stockId.set(null);
      }),
      map(params => {
        const idParam = params.get('id');
        if (!idParam) {
          throw new Error('Stock ID not found in route parameters.');
        }
        const id = parseInt(idParam, 10);
        if (isNaN(id)) {
          throw new Error('Invalid Stock ID format in route parameters.');
        }
        this.stockId.set(id);
        return id;
      }),
      switchMap(id => {
        return this.securityService.getListingDetails(id).pipe(
          catchError(err => {
            console.error('Error fetching listing details:', err);
            const message = err?.error?.message || err?.message || 'Failed to load stock details.';
            this.errorMessage.set(message);
            this.isLoading.set(false);
            return throwError(() => new Error(message));
          })
        );
      })
    ).subscribe({
      next: details => {
        this.listingDetails.set(details);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Subscription error handler:", err.message);
        this.isLoading.set(false);
      }
    });
  }
}
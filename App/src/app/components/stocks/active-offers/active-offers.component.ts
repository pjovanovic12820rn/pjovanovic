import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiveOfferDto } from '../../../models/active-offer.dto';
import { ActiveOffersService } from '../../../services/active-offers.service';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  standalone: true,
  selector: 'app-active-offers',
  templateUrl: './active-offers.component.html',
  styleUrls: ['./active-offers.component.css'],
  imports: [CommonModule, FormsModule, ButtonComponent]
})
export class ActiveOffersComponent implements OnInit {
  private activeOffersService = inject(ActiveOffersService);

  activeOffers: ActiveOfferDto[] = [];
  selectedOffer: ActiveOfferDto | null = null;
  counterPrice?: number;
  counterSettlementDate?: string;
  counterPremium?: number;
  errorMessage = '';
  loading = false;

  ngOnInit(): void {
    this.fetchActiveOffers();
  }

  fetchActiveOffers(): void {
    this.loading = true;
    console.log("fechuje")
    this.activeOffersService.getActiveOffers().subscribe({
      next: (offers) => {
        console.log(offers)
        this.activeOffers = offers;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load active offers.';
      }
    });
  }

  acceptOffer(offer: ActiveOfferDto): void {
    this.activeOffersService.acceptOffer(offer.id).subscribe({
      next: () => {
        this.activeOffers = this.activeOffers.filter(o => o.id !== offer.id);
      },
      error: () => {
        this.errorMessage = 'Failed to accept offer.';
      }
    });
  }

  declineOffer(offer: ActiveOfferDto): void {
    this.activeOffersService.declineOffer(offer.id).subscribe({
      next: () => {
        this.activeOffers = this.activeOffers.filter(o => o.id !== offer.id);
      },
      error: () => {
        this.errorMessage = 'Failed to decline offer.';
      }
    });
  }

  cancelOffer(offer: ActiveOfferDto): void {
    this.activeOffersService.cancelOffer(offer.id).subscribe({
      next: () => {
        this.activeOffers = this.activeOffers.filter(o => o.id !== offer.id);
      },
      error: () => {
        this.errorMessage = 'Failed to decline offer.';
      }
    });
  }

  openCounterOfferForm(offer: ActiveOfferDto): void {
    this.selectedOffer = offer;
    this.counterPrice = offer.pricePerStock;
    this.counterSettlementDate = offer.settlementDate;
    this.counterPremium = offer.premium;
  }

  sendCounterOffer(): void {
    if (!this.selectedOffer) return;
    const payload = {
      pricePerStock: this.counterPrice,
      settlementDate: this.counterSettlementDate,
      premium: this.counterPremium
    };
    this.activeOffersService.sendCounterOffer(this.selectedOffer.id, payload).subscribe({
      next: () => {
        this.selectedOffer = null;
      },
      error: () => {
        this.errorMessage = 'Failed to send counter offer.';
      }
    });
  }

  getColorClass(offer: ActiveOfferDto): string {
    const referencePrice = 150; // Example reference
    const difference = ((offer.pricePerStock - referencePrice) / referencePrice) * 100;
    if (Math.abs(difference) <= 5) return 'offer-green';
    if (Math.abs(difference) <= 20) return 'offer-yellow';
    return 'offer-red';
  }
}

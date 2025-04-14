import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

export interface OtcOfferDetails {
  volume: number | null;
  price: number | null;
  settlementDate: string;
  premium: number | null;
}

@Component({
  selector: 'app-otc-offer-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    ButtonComponent
  ],
  templateUrl: './otc-offer-modal.component.html',
  styleUrl: './otc-offer-modal.component.css'
})
export class OtcOfferModalComponent {
  @Input() isOpen: boolean = false;
  @Input() owner: string = '';
  @Input() stockSymbol: string = '';

  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() makeOfferEvent = new EventEmitter<OtcOfferDetails>();

  offerQuantity: number | null = null;
  offerPrice: number | null = null;
  settlementDateOffer: string = '';
  premiumOffer: number | null = null;

  quantityError: string | null = null;
  priceError: string | null = null;
  dateError: string | null = null;
  premiumError: string | null = null;


  closeModal(): void {
    this.resetFormAndErrors();
    this.closeModalEvent.emit();
  }

  makeOffer(): void {
    if (!this.validateOffer()) {
      return;
    }

    const offerDetails: OtcOfferDetails = {
      volume: this.offerQuantity,
      price: this.offerPrice,
      settlementDate: this.settlementDateOffer,
      premium: this.premiumOffer
    };

    this.makeOfferEvent.emit(offerDetails);
    this.closeModal();
  }

  private validateOffer(): boolean {
    this.resetErrors();
    let isValid = true;

    if (this.offerQuantity === null || this.offerQuantity === undefined || this.offerQuantity <= 0) {
      this.quantityError = 'Quantity is required and must be positive.';
      isValid = false;
    }

    if (this.offerPrice === null || this.offerPrice === undefined || this.offerPrice <= 0) {
      this.priceError = 'Price Offer is required and must be positive.';
      isValid = false;
    }

    if (!this.settlementDateOffer) {
      this.dateError = 'Settlement Date Offer is required.';
      isValid = false;
    }

    const today = new Date();
    const settlementDate = new Date(this.settlementDateOffer);
    if (settlementDate <= today) {
      this.dateError = 'Settlement Date Offer must be in the future.';
      isValid = false;
    }

    if (this.premiumOffer === null || this.premiumOffer === undefined || this.premiumOffer < 0) {
      this.premiumError = 'Premium Offer is required and cannot be negative.';
      isValid = false;
    }

    return isValid;
  }

  private resetFormAndErrors(): void {
    this.offerQuantity = null;
    this.offerPrice = null;
    this.settlementDateOffer = '';
    this.premiumOffer = null;
    this.resetErrors();
  }

  private resetErrors(): void {
    this.quantityError = null;
    this.priceError = null;
    this.dateError = null;
    this.premiumError = null;
  }
}

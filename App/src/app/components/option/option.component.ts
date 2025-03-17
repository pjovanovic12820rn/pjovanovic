import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OptionChain, OptionPair, OptionType } from '../../models/option.model';
import { OptionService } from '../../services/optin.service';

@Component({
  selector: 'app-options-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionsDisplayComponent implements OnInit, OnChanges {
  @Input() stockId: number = 0;

  optionChains: OptionChain[] = [];
  selectedExpirationIndex: number = 0;
  maxVisibleStrikes: number = 5;
  OptionType = OptionType;
// Use the global Math object directly
  Math: any = Math;

  constructor(private optionService: OptionService) {}

  ngOnInit(): void {
    if (this.stockId) {
      this.loadOptions();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stockId'] && !changes['stockId'].firstChange) {
      this.loadOptions();
    }
  }

  loadOptions(): void {
    this.optionService
      .getOptionChainsByStock(this.stockId)
      .subscribe((chains) => {
        this.optionChains = chains;

        if (this.optionChains.length > 0) {
          this.selectedExpirationIndex = 0;
        }
      });
  }

  selectExpiration(index: number): void {
    this.selectedExpirationIndex = index;
  }

  getVisiblePairs(): OptionPair[] {
    if (
      !this.optionChains.length ||
      this.selectedExpirationIndex >= this.optionChains.length
    ) {
      return [];
    }

    const chain = this.optionChains[this.selectedExpirationIndex];
    const pairs = [...chain.optionPairs];

    // Sort by proximity to stock price
    pairs.sort(
      (a, b) =>
        Math.abs(a.strikePrice - chain.stockPrice) -
        Math.abs(b.strikePrice - chain.stockPrice)
    );

    // Return pairs closest to current stock price
    return pairs.slice(0, this.maxVisibleStrikes);
  }

  isInTheMoney(optionType: OptionType, strikePrice: number): boolean {
    if (!this.optionChains.length) return false;

    const stockPrice =
      this.optionChains[this.selectedExpirationIndex].stockPrice;

    if (optionType === OptionType.CALL) {
      return stockPrice > strikePrice;
    } else {
      return stockPrice < strikePrice;
    }
  }

  isSharedPrice(strikePrice: number): boolean {
    if (!this.optionChains.length) return false;

    const stockPrice =
      this.optionChains[this.selectedExpirationIndex].stockPrice;
    return Math.abs(stockPrice - strikePrice) < 0.01;
  }

  calculateTheta(option: any): number {
    if (!option) return 0;

    const daysToExpiry =
      this.optionChains[this.selectedExpirationIndex].daysToExpiry;
    const timeValue =
      option.price -
      Math.max(
        0,
        option.optionType === OptionType.CALL
          ? option.underlyingStock.price - option.strikePrice
          : option.strikePrice - option.underlyingStock.price
      );

    return parseFloat((-(timeValue / daysToExpiry)).toFixed(2));
  }
}

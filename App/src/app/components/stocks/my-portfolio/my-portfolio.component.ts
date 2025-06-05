import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { PortfolioService } from '../../../services/portfolio.service';
import { MyPortfolio} from '../../../models/my-portfolio';
import { MyTax } from '../../../models/my-tax';
import { AccountResponse } from '../../../models/account-response.model';
import { AccountService } from '../../../services/account.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { InputTextComponent } from '../../shared/input-text/input-text.component';
import { OrderCreationModalComponent } from '../../shared/order-creation-modal/order-creation-modal.component';
import {ListingType} from '../../../enums/listing-type.enum';


@Component({
  selector: 'app-my-portfolio',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    OrderCreationModalComponent,
    ButtonComponent,
    ModalComponent,
    InputTextComponent,
    ButtonComponent,
    ModalComponent,
    InputTextComponent
  ],
  templateUrl: './my-portfolio.component.html',
  styleUrl: './my-portfolio.component.css'
})
export class MyPortfolioComponent implements OnInit {

  private alertService = inject(AlertService);
  private authService= inject(AuthService);
  private accountService= inject(AccountService);
  private portfolioService = inject(PortfolioService);

  isProfitModalOpen = false;
  isTaxModalOpen = false;
  isPublishModalOpen = false;
  isOrderModalOpen = false;

  publishAmount: number = 0;

  publishID: number = 0;
  myUser: number | null = 0;

  toBePublished: MyPortfolio | undefined;
  securityForSell: MyPortfolio | undefined;

  portfolio: MyPortfolio[] = [];
  taxes: MyTax | undefined;


  ngOnInit(): void {
    this.loadPortfolio();
    this.myUser = this.authService.getUserId();

  }

// Opens the order modal for selling a security
  openSellOrderModal(security: MyPortfolio): void {
    if (security.amount <= 0) {
      this.alertService.showAlert('warning', `No amount available to sell for ${security.securityName}.`);
      return;
    }

    this.securityForSell = security;
    this.isOrderModalOpen = true;
  }

  useListing(security: MyPortfolio): void {
    this.portfolioService.useListing(security.id).subscribe({
      next: value => { security.used = true },
      error: (err) => {
        console.error('Failed to use security! ', err);
        this.alertService.showAlert("error","Failed to use security!");
      }
    })
  }

  closeOrderModal(): void {
    this.isOrderModalOpen = false;
    this.securityForSell = undefined;
  }

  handleOrderCreation(): void {
    this.closeOrderModal();
    this.loadPortfolio();
    this.getMyTax();
  }

  loadPortfolio() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        this.portfolio = data;
      },
      error: (err) => {
        console.error('Failed to load portfolio data for this user! ', err);
        this.alertService.showAlert("error","Failed to load portfolio data for this user!");
      }
    });
  }

  profitFlag(){
    this.isProfitModalOpen = !this.isProfitModalOpen;
  }
  taxFlag(){
    this.isTaxModalOpen = !this.isTaxModalOpen;
    if(this.isTaxModalOpen){
      this.getMyTax();
    }
  }
  publishFlag(security: MyPortfolio){
    this.isPublishModalOpen = !this.isPublishModalOpen;
    this.toBePublished = security;
    this.publishID = security.id;

  }
  publishFlagClose(){
    this.isPublishModalOpen = !this.isPublishModalOpen;
    this.publishID = 0;
    this.publishAmount = 0;
  }

  getMyTax(){
    this.portfolioService.getMyTaxes().subscribe({
      next: (data) => {

        this.taxes = data
      },
      error: () => {
        this.alertService.showAlert('error', 'Failed to load your taxes!');
      }
    });
  }


  makeSecurityPublicServiceCall(entryId: number) {
    if(this.toBePublished?.amount != undefined && this.toBePublished?.amount >= this.publishAmount && this.publishAmount>0) {


      this.portfolioService.setPublicAmount(entryId, this.publishAmount).subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Successfully made public!');
          this.loadPortfolio();
        },
        error: () => {
          this.alertService.showAlert('error', 'Failed to set public amount!');
        }
      });

    }else{
      this.alertService.showAlert('error', 'Publish not possible, chosen amount is bigger the available amount!');
    }

    this.isPublishModalOpen = false;
    this.publishID = 0;
    this.publishAmount = 0;

  }

  getTotalProfit(): number{

    let profit = 0;

    for (let portfolioItem of this.portfolio) {
      profit += portfolioItem.profit;
    }

    return profit;
  }

  protected readonly ListingType = ListingType;
}

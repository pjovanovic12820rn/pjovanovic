import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { NgForOf, NgIf} from '@angular/common';
import {PortfolioService} from '../../services/portfolio.service';
import {ButtonComponent} from '../shared/button/button.component';
import {ModalComponent} from '../shared/modal/modal.component';
import {MyPortfolio} from "../../models/my-portfolio";
import {MyTax} from '../../models/my-tax';
import {InputTextComponent} from '../shared/input-text/input-text.component';
import {AccountResponse} from '../../models/account-response.model';
import {AccountService} from '../../services/account.service';
import {OrderService} from '../../services/order.service';



@Component({
  selector: 'app-my-portfolio',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
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
  private orderService = inject(OrderService);
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);

  isProfitModalOpen = false;
  isTaxModalOpen = false;
  isPublishModalOpen = false;
  isOrderModalOpen = false;

  publishAmount: number = 0;
  amountToSell: number = 0;
  LimitPrice: number = 0;
  StopPrice: number = 0;

  publishID: number = 0;
  myUser: number | null = 0;
  selectedAccountNumber: string | null = null;

  toBePublished: MyPortfolio | undefined;
  securityForSell: MyPortfolio | undefined;

  myAccounts: AccountResponse[] = [];

  portfolio: MyPortfolio[] = [];
  taxes: MyTax | undefined;


  ngOnInit(): void {

    this.loadPortfolio();
    this.myUser = this.authService.getUserId();
    this.getMyAccounts();

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
  orderModalFlag(securitySell: MyPortfolio){
    this.isOrderModalOpen = !this.isOrderModalOpen;
    this.securityForSell = securitySell;
  }
  orderModalFlagClose(){
    this.isOrderModalOpen = !this.isOrderModalOpen;
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

  sellListing(){

    if(this.selectedAccountNumber == null || this.amountToSell <= 0 || this.LimitPrice <=0 || this.StopPrice <=0 || ( this.securityForSell?.amount != null && this.amountToSell > this.securityForSell?.amount)){
      this.alertService.showAlert('error', 'Your selection was not correct, make sure there is enough chosen amount!');
    }
    else{

      this.orderService.makeOrder(4,this.amountToSell,1,this.selectedAccountNumber).subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Successfully ordered!');
        },
        error: () => {
          this.alertService.showAlert('error', 'Failed to make order for selling Security!');
        }
      });
      this.alertService.showAlert('success', 'Great, you just sold you security!');
    }
    this.orderModalFlagClose();
  }

  getMyAccounts() {
    this.accountService.getMyAccountsRegular().subscribe({
      next: (accounts) => {
        this.myAccounts = accounts;
      },
      error: () => {
        this.alertService.showAlert('error', 'Failed to load your accounts.');
      },
    });
  }

  makeSecurityPublicServiceCall(entryId: number) {

    if(this.toBePublished?.amount != undefined && this.toBePublished?.amount > this.publishAmount && this.publishAmount>0) {


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
  // OVo je ono sto je postojalo pre!

  // isOrderModalOpen = false;
  // selectedSecurityForOrder: Securities | null = null;
  // orderDirection: 'BUY' | 'SELL' = 'BUY';
  //
  //
  // openSellOrderModal(security: Securities): void {
  //   if (security.amount <= 0) {
  //     this.alertService.showAlert('warning', `No amount available to sell for ${security.ticker}.`);
  //     return;
  //   }
  //   this.selectedSecurityForOrder = security;
  //   this.orderDirection = 'SELL';
  //   this.isOrderModalOpen = true;
  // }
  //
  // closeOrderModal(): void {
  //   this.isOrderModalOpen = false;
  //   this.selectedSecurityForOrder = null;
  // }
  //
  // handleOrderCreation(orderDetails: any): void {
  //   console.log('Order creation requested from MyPortfolioComponent:', orderDetails, 'for security:', this.selectedSecurityForOrder);
  //   this.closeOrderModal();
  // }
  //
  // get currentSecurityPrice(): number {
  //   return this.selectedSecurityForOrder?.price ?? 0;
  // }
  //
  // get currentContractSize(): number {
  //   return 1;
  // }


}

import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [NgClass, NgIf, ModalComponent, RouterLink, ButtonComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent implements OnInit, OnDestroy {
  @Input() isSidebarOpen: boolean = false;
  protected router = inject(Router);
  protected authService = inject(AuthService);

  isAuthenticated = false;
  isAdmin = false;
  isSupervisor = false;
  isEmployee = false;
  isClient = false;
  userId: number | null = null;
  private authSubscription!: Subscription;
  isModalOpen: boolean = false;
  isAccountModalOpen: boolean = false;

  ngOnInit(): void {
    this.authSubscription = this.authService.authStatus$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      if (this.isAuthenticated) {
        this.isAdmin = this.authService.isAdmin();
        this.isEmployee = this.authService.isEmployee();
        this.isClient = this.authService.isClient();
        this.isSupervisor = this.authService.isSupervisor();
        this.userId = this.authService.getUserId();
      } else {
        this.isAdmin = false;
        this.isEmployee = false;
        this.isClient = false;
        this.isSupervisor = false;
        this.userId = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  navigateTo(route: string) {
    this.isModalOpen = false;
    this.router.navigate([route]).then(r => {});
  }

  goToClientPortalOrUserDetail() {
    if (this.isClient && this.userId) {
      this.navigateTo(`/user/${this.userId}`);
    } else {
      this.navigateTo('/client-portal');
    }
  }

  goToAccountManagement() {
    this.navigateTo(`/account-management`);
  }

  goToPayments() {
    this.openModal()
  }

  goToEmployees(){
    this.navigateTo('/employees');
  }

  goToExchangeRate() {
    this.navigateTo('/exchange-rate');
  }

  goToLoans() {
    if (this.isClient) {
      this.navigateTo(`/loan-management/${this.userId}`);
    } else {
      this.navigateTo('/loan-requests');
    }
  }

  goToPortfolio() {
    this.navigateTo('/my-portfolio');
  }

  goToBankAccounts() {
    this.navigateTo('/bank-accounts');
  }

  goToSecurities() {
    this.navigateTo('/securities');
  }

  goToActuaries() {
    this.navigateTo('/actuaries');
  }

  goToBankProfit() {
    this.navigateTo('/bank-profit');
  }

  goToTaxPortal() {
    this.navigateTo('/tax-portal');
  }

  goToOrderList() {
    if (!this.isClient) {
      this.navigateTo(`/order-overview`);
    } else {
      this.navigateTo('/my-orders');
    }
  }

  goToSettledContracts(){
    this.navigateTo('/settled-contracts');
  }

  goToOtc(){
    this.navigateTo('/otc');
  }

  goToActiveOffers(){
    this.navigateTo('/active-offers');
  }
}

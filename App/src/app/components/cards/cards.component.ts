import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { CardService, Card } from '../../services/card.service'
import { AccountService } from '../../services/account.service'
import {NgClass, NgForOf, NgIf} from '@angular/common'
import {ModalComponent} from '../shared/modal/modal.component';
import {AuthService} from '../../services/auth.service';
// import { ModalComponent } from '../modal/modal.component'

interface Account {
  accountName: string
  accountNumber: string
  accountOwner: string
  accountType: string
  availableBalance: number
  reservedFunds: number
  balance: number
}

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  standalone: true,
  imports: [NgClass, NgForOf, RouterLink, ModalComponent, NgIf], //, ModalComponent
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  account: Account | null = null
  cards: Card[] = []
  accountNumber: string = ''
  isModalOpen: boolean = false

  constructor(protected authService: AuthService, private route: ActivatedRoute, private cardService: CardService, private accountService: AccountService) {}

  ngOnInit(): void {
    const paramAcc = this.route.snapshot.paramMap.get('accountNumber')
    if (paramAcc) {
      this.accountNumber = paramAcc
      this.accountService.getAccountDetails(this.accountNumber).subscribe(data => {
        this.account = data
        console.log(data)
      })
      this.loadCards()
    }
  }

  loadCards(): void {
    if(this.authService.isClient()) {
      this.cardService.getMyCardsForAccount(this.accountNumber).subscribe(data => {
        this.cards = data
      })
    } else {
      this.cardService.getCardsByAccount(this.accountNumber).subscribe(data => {
        this.cards = data
      })
    }
// idk was this     this.cardService.getUserCardsForAccount(this.accountNumber).subscribe(data => {
//       this.cards = data
//     })
  }

  blockCard(cardNumber: string, status: string): void {
    if (status === 'BLOCKED') {
      // Unblock the card
      this.cardService.unblockCard(this.accountNumber, cardNumber).subscribe({
        next: () => {
          this.updateCardStatus(cardNumber, 'ACTIVE'); // Update UI immediately
        },
      });
    } else {
      // Block the card
      if (this.authService.isClient()) {
        this.cardService.blockCardByUser(this.accountNumber, cardNumber).subscribe({
          next: () => {
            this.updateCardStatus(cardNumber, 'BLOCKED'); // Update UI immediately
          },
        });
      } else {
        this.cardService.blockCardByAdmin(this.accountNumber, cardNumber).subscribe({
          next: () => {
            this.updateCardStatus(cardNumber, 'BLOCKED'); // Update UI immediately
          },
        });
      }
    }
  }

  deactivateCard(cardNumber: string): void {
    if (this.authService.isAdmin()) {
      this.cardService.deactivateCard(this.accountNumber, cardNumber).subscribe({
        next: () => {
          this.updateCardStatus(cardNumber, 'DEACTIVATED'); // Update UI immediately
        },
      });
    }
  }

// ✅ Helper function to update the card's status in the UI
  private updateCardStatus(cardNumber: string, newStatus: string): void {
    const card = this.cards.find(c => c.cardNumber === cardNumber);
    if (card) {
      card.status = newStatus;
    }
  }


  getCardStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'status-active'
      case 'BLOCKED':
        return 'status-blocked'
      case 'DEACTIVATED':
        return 'status-deactivated'
      default:
        return ''
    }
  }

  maskCardNumber(fullCardNumber: string): string {
    if (!fullCardNumber || fullCardNumber.length < 8) return fullCardNumber
    const first4 = fullCardNumber.slice(0, 4)
    const last4 = fullCardNumber.slice(-4)
    return `${first4}********${last4}`
  }

  makePayment(cardNumber: string): void {
  }

  openModal() {
    this.isModalOpen = true
  }

  closeModal() {
    this.isModalOpen = false
  }
}

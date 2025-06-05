import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService, CreateCardDto } from '../../../services/card.service';
import { AuthService } from '../../../services/auth.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputTextComponent } from '../../shared/input-text/input-text.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputTextComponent
  ]
})
export class CreateCardComponent implements OnInit {
  accountNumber: string = '';
  cardForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.cardForm = this.fb.group({
      accountNumber: ['', Validators.required],
      type: ['DEBIT', Validators.required],
      issuer: ['VISA', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]],
      cardLimit: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const acc = this.route.snapshot.paramMap.get('accountNumber');
    if (acc) {
      this.accountNumber = acc;
      this.cardForm.patchValue({
        accountNumber: acc
      });
    }
  }

  onSubmit() {
    if (this.cardForm.invalid) return;

    const dto: CreateCardDto = this.cardForm.value;

    if (this.authService.isClient()) {
      this.cardService.requestCard(dto).subscribe({
        next: () => this.handleSuccess('Card Request Successful!', 'Your card request has been submitted successfully.'),
        error: (err) => this.handleError(err, 'request')
      });
    } else {
      this.cardService.createCard(dto).subscribe({
        next: () => this.handleSuccess('Card Created Successfully!', 'The card has been created successfully.'),
        error: (err) => this.handleError(err, 'create')
      });
    }
  }

  private handleSuccess(title: string, message: string): void {
    this.router.navigate(['/success'], {
      state: {
        title: title,
        message: message,
        buttonName: 'Go Back to Cards',
        continuePath: `/account/${this.accountNumber}`
      }
    });
  }

  private handleError(err: any, action: string): void {
    console.error(`Failed to ${action} card:`, err);
  }
}

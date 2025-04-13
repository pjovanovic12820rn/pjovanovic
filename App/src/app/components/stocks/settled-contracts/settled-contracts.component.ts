import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/button/button.component';
import { AlertService } from '../../../services/alert.service';
import { ContractsService } from '../../../services/contracts.service';
import { SettledContractDto } from '../../../models/settled-contract-dto';

@Component({
  selector: 'app-settled-contracts',
  templateUrl: './settled-contracts.component.html',
  styleUrls: ['./settled-contracts.component.css'],
  standalone: true,
  imports: [FormsModule, NgForOf, ButtonComponent, NgIf, CurrencyPipe],
})
export class SettledContractsComponent implements OnInit{
  contracts: SettledContractDto[] = [];
  loading = false;

  constructor(
    private contractsService: ContractsService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.loading = true;
    this.contractsService.getSettledContracts().subscribe({
      next: (data) => {
        this.contracts = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.alertService.showAlert('error', 'Failed to load settled contracts: ' + err.message);
      }
    });
  }

  onExercise(contract: SettledContractDto): void {
    if (contract.status !== 'VALID') {
      this.alertService.showAlert('error', 'This contract cannot be exercised.');
      return;
    }

    this.contractsService.exerciseContract(contract.id).subscribe({
      next: () => {
        this.alertService.showAlert('success', 'Contract exercised!');
        this.router.navigate(['/success'], {
          state: {
            title: 'Contract Exercised',
            message: `Successfully exercised contract #${contract.id}`,
            buttonName: 'Back to Settled Contracts',
            continuePath: '/settled-contracts'
          }
        });
      },
      error: (err) => {
        this.alertService.showAlert('error', 'Error exercising contract: ' + err.message);
      },
    });
  }
}

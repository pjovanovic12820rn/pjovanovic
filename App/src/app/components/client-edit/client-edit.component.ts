import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertComponent} from '../alert/alert.component';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css'],
})
export class ClientEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  client: User = { id: 0, firstName: '', lastName: '', email: '', gender: '', birthDate: new Date(), jmbg:'', };
  formattedBirthDate: string = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.client = response;
        this.formattedBirthDate = this.formatDate(this.client.birthDate);
      },
      error: () => {
        this.alertService.showAlert("error", "Failed to load user data. Please try again later.");
      }
    });
  }

  formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  saveClient(): void {
    this.client.birthDate = new Date(this.formattedBirthDate);
    this.userService.updateUser(this.client.id, this.client).subscribe({
      next: () => {
        this.router.navigate(['/client-portal']);
      },
      error: (err) => {
        console.error('Error saving user data', err);
        this.alertService.showAlert("error", "Failed to save user data. Please try again later.");
      }
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/client-portal']);
  }
}

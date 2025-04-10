import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActuariesService } from '../../../services/actuaries.service';
import { AuthService } from '../../../services/auth.service';
import { ActuaryAgentDto } from '../../../models/actuary-agent.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-actuaries-agents',
  templateUrl: './actuaries-agents.component.html',
  styleUrls: ['./actuaries-agents.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ActuariesAgentsComponent implements OnInit, OnDestroy {
  agents: ActuaryAgentDto[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private actuariesService: ActuariesService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isSupervisor() && !this.authService.isAdmin()) {
      this.errorMessage = 'Access denied. Only supervisors can access this portal.';
      return;
    }
    this.loadAgents();
  }

  loadAgents(): void {
    this.loading = true;
    this.errorMessage = '';
    this.actuariesService.getActuariesAgents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ActuaryAgentDto[]) => {
          this.agents = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading actuaries agents', err);
          this.errorMessage = 'Failed to load actuaries agents. Please try again later.';
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

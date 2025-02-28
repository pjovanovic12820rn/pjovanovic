import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  standalone: true,
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  @Input() message: string = 'Operation successful!';
  @Input() title: string = 'Success!';
  @Input() buttonName: string = 'Continue';
  @Input() continuePath: string = '/';

  constructor(private router: Router) {}

  onContinue(): void {
    this.router.navigate([this.continuePath]);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})export class NavbarComponent {
  constructor(private router: Router) {}

  AllEmployees() {
    this.router.navigate(['/employees']);
  }

  AllUsers() {
    this.router.navigate(['/users']);
  }

  logout() {
    console.log("Logging out...");
    this.router.navigate(['/login']);
  }
}

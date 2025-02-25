import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  imports: [
    NgIf
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})export class NavbarComponent {

  isAuthenticated: boolean = false; // property for JWT check

  constructor(private router: Router,private authService: AuthService) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    this.isAuthenticated = !!sessionStorage.getItem('auth_token'); // If exist
  }

  AllEmployees() {
    this.router.navigate(['/employees']);
  }

  AllUsers() {
    this.router.navigate(['/users']);
  }

  logout() {
    console.log("Logging out...");
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  logIn() {
    this.router.navigate(['/login']);
  }
}

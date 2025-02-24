import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {AlertComponent} from './components/alert/alert.component';
import {RegisterEmployeeComponent} from './components/register-employee.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AlertComponent,RegisterEmployeeComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'App';
}

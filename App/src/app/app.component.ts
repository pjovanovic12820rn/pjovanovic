import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './components/shared/navbar/navbar.component';
import {AlertComponent} from './components/shared/alert/alert.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AlertComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'App';
}

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  standalone: true,
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() type: string = 'button'; // Input for button text
  @Input() class: string = ''; // Input for button text
  @Input() disabled: boolean | null = false; // Input for button text
  @Output() onClick = new EventEmitter<void>(); // Output for click event
}

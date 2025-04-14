import { Component, forwardRef, Input, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import {InputTextComponent} from '../input-text/input-text.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'autocomplete-text',
  templateUrl: './autocomplete-text.component.html',
  styleUrls: ['./autocomplete-text.component.css'],
  standalone: true,
  imports: [
    InputTextComponent,
    NgIf,
    NgForOf
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteTextComponent),
      multi: true
    }
  ]
})
export class AutocompleteTextComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() options: any[] = [];
  @Input() filterKey: string = '';
  @Input() errors: string[] = [];
  @Input() showErrors: boolean = false;
  @Input() formControlComp: FormControl = new FormControl();
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('input') input!: ElementRef;

  value: string = '';
  filteredOptions: any[] = [];
  isOpen = false;
  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value || '';
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.filter(this.value);
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  filter(value: string) {
    this.filteredOptions = this.options.filter(option =>
      option[this.filterKey].toLowerCase().includes(value.toLowerCase())
    );
    this.isOpen = true;
  }

  selectOption(option: any) {
    this.value = option[this.filterKey];
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.input?.nativeElement?.contains(event.target)) {
      this.isOpen = false;
    }
  }

  onBlur() {
    this.onTouched();
    this.isOpen = false;
  }
}

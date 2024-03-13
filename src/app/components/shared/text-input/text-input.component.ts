import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';

  // Self makes sure that the ngControl Injected to the component will always stay the same in the memory.
  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this; // Setting the ngControl value accessor to the TextInputComponent that implements the ControlValueAccessor.
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  // Get is a keyword that when we try to access the control keyword in our template we will get what inside the return function.
  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}

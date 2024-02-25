import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  model: any = {};
  @Output() cancelRegister = new EventEmitter();

  constructor(private accountService: AccountService) {}

  register() {
    this.accountService.register(this.model).subscribe({
      next: () => this.cancel(),
      error: (err) => console.log(err),
    });
  }

  cancel() {
    this.cancelRegister.emit();
  }
}

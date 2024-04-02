import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);

  return accountService.currentUser$.pipe(
    map((user) => {
      if (user) {
        return user.roles.includes('Admin') || user.roles.includes('Moderator');
      }
      console.log('You shall not pass!');
      return false;
    })
  );
};

import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../components/members/member-edit/member-edit.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<
  MemberEditComponent
> = (component) => {
  if (component.editForm?.dirty) {
    return confirm(
      'Are you sure you want to continue? Ant unsaved changes will be lost!'
    );
  }
  return true;
};

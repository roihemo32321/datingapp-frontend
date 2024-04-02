import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { EditRolesModalComponent } from '../../modals/edit-roles-modal/edit-roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];

  constructor(private adminService: AdminService, private _dialog: MatDialog) {}

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService
      .getUsersWithRoles()
      .subscribe({ next: (users: User[]) => (this.users = users) });
  }

  openDialog(user: User) {
    const dialogRef = this._dialog.open(EditRolesModalComponent, {
      data: { username: user.username, roles: [...user.roles] },
    });

    dialogRef.afterClosed().subscribe({
      next: (selectedRoles: string[]) => {
        console.log(selectedRoles);
        console.log(user.roles);

        if (selectedRoles && !this.arrayEquals(selectedRoles, user.roles)) {
          console.log('Check here');

          this.adminService
            .updateUserRoles(user.username, selectedRoles)
            .subscribe({ next: (roles) => (user.roles = roles) });
        }
      },
    });
  }

  private arrayEquals(arr1: string[], arr2: string[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
}

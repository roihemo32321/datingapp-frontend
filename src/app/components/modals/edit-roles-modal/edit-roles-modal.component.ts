import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-roles-modal',
  templateUrl: './edit-roles-modal.component.html',
  styleUrl: './edit-roles-modal.component.scss',
})
export class EditRolesModalComponent implements OnInit {
  selectedRoles: any[] = [];
  rolesOptions = ['Admin', 'Moderator', 'Member'];

  constructor(
    public dialogRef: MatDialogRef<EditRolesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dialogRef.updateSize(this.data?.width ?? '600PX');
    this.selectedRoles = this.data?.roles ?? [];
  }

  toggleRole(checkedValue: string) {
    const index = this.selectedRoles.indexOf(checkedValue);
    if (index === -1) {
      this.selectedRoles.push(checkedValue);
    } else {
      this.selectedRoles.splice(index, 1);
    }
  }
}

import { Component, Input } from '@angular/core';
import { Member } from '../../../models/member';
import { FileUploadService } from '../../../services/file-upload.service';
import { Photo } from '../../../models/photo';
import { User } from '../../../models/user';
import { AccountService } from '../../../services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-edit-photos',
  templateUrl: './edit-photos.component.html',
  styleUrl: './edit-photos.component.scss',
})
export class EditPhotosComponent {
  @Input() member: Member | undefined;
  user: User | undefined;

  constructor(
    private uploadPhotoService: FileUploadService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }

  setMainPhoto(photo: Photo) {
    this.uploadPhotoService.setMainPhoto(photo.id).subscribe({
      next: () => {
        // Checking that we have a user and a member that we want to edit his photo.
        if (this.user && this.member) {
          this.user.photoUrl = photo.url; // Setting the user photoUrl to the photo url selected.
          this.accountService.setCurrentUser(this.user); // Setting the user to the new user.
          this.member.photoUrl = photo.url; // Setting it in the member array.
          // Loop over the member photos and disable all isMain then setting the selected photo to main.
          this.member.photos.forEach((p) => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          });
        }
      },
    });
  }

  deletePhoto(photoId: number) {
    this.uploadPhotoService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(
            (p) => p.id !== photoId
          );
        }
      },
    });
  }
}

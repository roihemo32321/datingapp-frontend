import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Photo } from '../models/photo';
import { MembersService } from './members.service';
import { AccountService } from './account.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  baseUrl = environment.apiUrl;
  formData: FormData | undefined;

  constructor(private http: HttpClient) {}

  uploadFileDb() {
    if (this.formData) {
      return this.http.post<Photo>(
        this.baseUrl + 'users/add-photo',
        this.formData
      );
    }

    return null;
  }

  uploadFile(fileData: FormData) {
    this.formData = fileData;
  }

  setMainPhoto(photoId: number) {
    return this.http.put(`${this.baseUrl}users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}users/delete-photo/${photoId}`);
  }
}

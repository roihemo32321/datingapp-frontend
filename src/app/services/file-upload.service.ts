import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  uploadFile(file: FormData) {
    return this.http.post(this.baseUrl + 'users/add-photo', file);
  }
}

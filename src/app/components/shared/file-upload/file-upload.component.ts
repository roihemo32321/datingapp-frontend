import { Component } from '@angular/core';
import { FileUploadService } from '../../../services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  constructor(private uploadFileService: FileUploadService) {}

  uploadFile(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      console.log(formData);

      this.uploadFileService.uploadFile(formData).subscribe();
    }
  }
}

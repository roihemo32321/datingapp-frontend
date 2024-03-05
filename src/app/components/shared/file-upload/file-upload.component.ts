import { Component, Input, OnInit } from '@angular/core';
import { FileUploadService } from '../../../services/file-upload.service';
import { Member } from '../../../models/member';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent implements OnInit {
  @Input() member: Member | undefined;

  constructor(private uploadFileService: FileUploadService) {}

  ngOnInit(): void {}

  uploadFile(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.uploadFileService.uploadFile(formData);
    }
  }
}

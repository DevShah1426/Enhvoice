import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-upload-files",
  templateUrl: "./upload-files.component.html",
  styleUrl: "./upload-files.component.css",
})
export class UploadFilesComponent {
  @Output() closeEvent = new EventEmitter();
  filesToUpload: any[] = [];
  uploadFileVisible: boolean = true;
  close() {
    this.closeEvent.emit();
  }

  fileChange(event: any) {
    let fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      // multiple file
      for (let i = 0; i < fileList.length; i++) {
        this.filesToUpload.push(fileList[i]);
      }
      this.uploadFileVisible = false;
    }
  }
}

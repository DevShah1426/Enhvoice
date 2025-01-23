import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { AlertDetails } from "../../../shared/models/alert-details";
import { AlertDialogService } from "../../../shared/services/alert-dialog.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-uploaded-folders",
  templateUrl: "./uploaded-folders.component.html",
  styleUrl: "./uploaded-folders.component.css",
})
export class UploadedFoldersComponent implements OnInit, OnDestroy {
  @Input() uploadedFolders: any[] = [];
  @Output() selectedFolderChange = new EventEmitter<any>();
  @ViewChild("bottom") bottom!: ElementRef;
  resultSubscription: Subscription | any;
  fileColors: any[] = ["#0475DD", "#DF9300"];
  displayFolderCount = 5;
  displayFileCount = 3;
  @Input() selectedFolder: any;

  constructor(private alertDialogService: AlertDialogService, private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.uploadedFolders.forEach((folder: any) => {
        let verifiedCount = 0;

        // Iterate over the files and count how many are verified
        folder.files.forEach((file: any) => {
          if (file.status === "verified") {
            verifiedCount++;
          }
        });

        // Update the count property
        folder.count = verifiedCount.toString(); // Convert to string as per your original structure
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  selectedFolderChanged(): void {
    this.selectedFolderChange.emit(this.selectedFolder);
  }

  loadMore(): void {
    this.displayFolderCount = this.uploadedFolders.length;
    setTimeout(() => {
      this.scrollToBottom();
    }, 10);
  }

  loadLess(): void {
    this.displayFolderCount = 5;
  }

  loadMoreFiles(): void {
    this.displayFileCount += 3;
  }

  loadLessFiles(): void {
    this.displayFileCount -= 3;
  }

  scrollToBottom(): void {
    try {
      // this.bottom.nativeElement.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error scrolling to bottom:", err);
    }
  }

  openFolder(folder: any) {
    if (this.selectedFolder && this.selectedFolder.folderName == folder.folderName) {
      this.selectedFolder = null;
    } else {
      this.displayFileCount = folder.files.length;
      this.selectedFolder = folder;
      this.selectedFolderChanged();
    }
  }

  selectFile(file: any) {
    if (file.status.toLowerCase() == "verified") {
      let alertDialogDetails: AlertDetails = {
        showSuccessIcon: true,
        title: "Verification Status",
        message: "Verification Complete",
        description: file.fileName + " has been completed and verified",
        showOkButton: true,
        okButtonLabel: "Ok",
        details: {
          documentName: file.fileName,
          templateName: file.templateName,
        },
      };
      this.alertDialogService.openAlertDialog(alertDialogDetails);
      // Unsubscribe from any previous subscription
      if (this.resultSubscription) {
        this.resultSubscription.unsubscribe();
      }
      this.resultSubscription = this.alertDialogService.result$.subscribe((result: any) => {
        if (result) {
          this.router.navigate(["/enhancor/transactions/result"], {
            queryParams: { id: file.id },
          });
        }
      });
    } else {
      this.router.navigate(["/enhancor/transactions/result"], {
        queryParams: { id: file.id },
      });
    }
  }
}

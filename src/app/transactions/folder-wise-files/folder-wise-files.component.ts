import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { AlertDetails } from "../../shared/models/alert-details";
import { AlertDialogService } from "../../shared/services/alert-dialog.service";
import { TransactionsService } from "../transactions.service";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";

@Component({
  selector: "app-folder-wise-files",
  templateUrl: "./folder-wise-files.component.html",
  styleUrl: "./folder-wise-files.component.css",
})
export class FolderWiseFilesComponent implements OnInit, OnDestroy {
  @Input() folderDetails: any = null;
  @Input() activeSelection: string = "";
  @Output() selectedFolder: EventEmitter<any> = new EventEmitter();
  fileColors: any[] = ["#0475DD", "#DF9300"];
  resultSubscription: Subscription | any;
  ugpId: any = localStorage.getItem("ugpId");
  constructor(
    private router: Router,
    private alertDialogService: AlertDialogService,
    private transactionsService: TransactionsService,
    private messageService: MessageService
  ) {}
  ngOnDestroy(): void {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {}

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
          updateDtTm: file.updateDtTm,
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

  reprocess(file: any) {
    this.transactionsService.reprocess(file.id).subscribe((data: any) => {
      if (data.status.toLowerCase() == "success" || data.status.toLowerCase() == "uploaded") {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Document reprocessed successfully.",
        });
        this.router.navigate(["/enhancor/transactions/result"], {
          queryParams: { id: file.id },
        });
      } else {
        this.messageService.add({ severity: "error", summary: "Error", detail: data.message });
      }
    });
  }

  requestChange(file: any) {
    let alertDialogDetails: AlertDetails = {
      showWarningIcon: true,
      title: "Apply for change request?",
      message: "Are you sure you want to apply for change request?",
      showOkButton: true,
      okButtonLabel: "Apply",
    };
    this.alertDialogService.openAlertDialog(alertDialogDetails);
    // Unsubscribe from any previous subscription
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
    this.resultSubscription = this.alertDialogService.result$.subscribe((result: any) => {
      if (result) {
        this.transactionsService.requestChange({ id: file.id }).subscribe((res: any) => {
          if (res.status.toLowerCase() == "success") {
            this.messageService.add({ severity: "success", summary: "Success", detail: res.message });
            this.getUpdatedDate();
          } else {
            this.messageService.add({ severity: "error", summary: "Error", detail: res.message });
          }
        });
      }
    });
  }

  approveChange(file: any) {
    let alertDialogDetails: AlertDetails = {
      showWarningIcon: true,
      title: "Approve Change Request?",
      message: "Are you sure you want to approve change request?",
      showOkButton: true,
      okButtonLabel: "Approve",
    };
    this.alertDialogService.openAlertDialog(alertDialogDetails);
    // Unsubscribe from any previous subscription
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
    this.resultSubscription = this.alertDialogService.result$.subscribe((result: any) => {
      if (result) {
        this.transactionsService.approveChange({ id: file.id }).subscribe((res: any) => {
          if (res.status.toLowerCase() == "success") {
            this.messageService.add({ severity: "success", summary: "Success", detail: res.message });
            this.getUpdatedDate();
          } else {
            this.messageService.add({ severity: "error", summary: "Error", detail: res.message });
          }
        });
      }
    });
  }

  rejectChange(file: any) {
    let alertDialogDetails: AlertDetails = {
      showWarningIcon: true,
      title: "Reject Change Request?",
      message: "Are you sure you want to reject change request?",
      showOkButton: true,
      okButtonLabel: "Reject",
    };
    this.alertDialogService.openAlertDialog(alertDialogDetails);
    // Unsubscribe from any previous subscription
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
    this.resultSubscription = this.alertDialogService.result$.subscribe((result: any) => {
      if (result) {
        this.transactionsService.rejectChange({ id: file.id }).subscribe((res: any) => {
          if (res.status.toLowerCase() == "success") {
            this.messageService.add({ severity: "success", summary: "Success", detail: res.message });
            this.getUpdatedDate();
          } else {
            this.messageService.add({ severity: "error", summary: "Error", detail: res.message });
          }
        });
      }
    });
  }

  getUpdatedDate() {
    this.selectedFolder.emit({ activeSelection: this.activeSelection, selectedFolder: this.folderDetails });
  }
}

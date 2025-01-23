import { Injectable, OnDestroy } from "@angular/core";
import { AlertDetails } from "../models/alert-details";
import { AlertComponent } from "../components/alert/alert.component";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subject, Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AlertDialogService implements OnDestroy {
  ref: DynamicDialogRef | any;
  private resultSubject = new Subject<any>();
  result$ = this.resultSubject.asObservable();
  private subscription: Subscription | null = null;

  constructor(public dialogService: DialogService) {}

  openAlertDialog(alertDetails: AlertDetails) {
    this.ref = this.dialogService.open(AlertComponent, {
      height: "auto",
      width: "500px",
      data: alertDetails,
      closable: false,
      showHeader: false,
    });

    // Unsubscribe from any previous subscription to avoid multiple triggers
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Subscribe to the dialog's onClose event
    this.subscription = this.ref.onClose.subscribe((result: any) => {
      this.resultSubject.next(result);
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

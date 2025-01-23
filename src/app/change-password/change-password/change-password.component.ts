import { Component, OnDestroy, OnInit } from "@angular/core";
import { HeaderService } from "../../shared/services/header.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ChangePasswordService } from "../change-password.service";
import { AlertDialogService } from "../../shared/services/alert-dialog.service";
import { AlertDetails } from "../../shared/models/alert-details";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrl: "./change-password.component.css",
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordForm: FormGroup | any;
  resultSubscription: Subscription | any;
  constructor(
    private headerService: HeaderService,
    private changePasswordService: ChangePasswordService,
    private alertDialogService: AlertDialogService,
    private messageService: MessageService,
    private router: Router
  ) {
    headerService.updateHeader({
      title: "Change password",
      icon: "password",
    });
  }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      newPassword: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      confirmPassword: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
    });
  }

  ngOnDestroy(): void {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  changePassword() {
    const newPassword = this.changePasswordForm.get("newPassword");
    const confirmPassword = this.changePasswordForm.get("confirmPassword");

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "New password and Confirm New Password does not match.",
      });
      return;
    }
    this.changePasswordForm.addControl("id", new FormControl(localStorage.getItem("userId")));
    this.changePasswordService.changePassword(this.changePasswordForm.value).subscribe((data: any) => {
      if (data.status.toLowerCase() == "success") {
        let alertDialogDetails: AlertDetails = {
          showSuccessIcon: true,
          title: "Success",
          message: "Password changed successfully.",
          description: "Please login again with new password.",
          showOkButton: true,
          okButtonLabel: "Ok",
          showCloseButton: false,
        };
        this.alertDialogService.openAlertDialog(alertDialogDetails);
        // Unsubscribe from any previous subscription
        if (this.resultSubscription) {
          this.resultSubscription.unsubscribe();
        }
        this.resultSubscription = this.alertDialogService.result$.subscribe((result: any) => {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(["/"]);
        });
      } else {
        this.messageService.add({
          severity: "warn",
          summary: "Warning",
          detail: data.message,
        });
      }
    });
  }
}

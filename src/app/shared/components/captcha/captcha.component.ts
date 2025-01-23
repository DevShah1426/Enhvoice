import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AlertDetails } from "../../models/alert-details";
import { AlertDialogService } from "../../services/alert-dialog.service";
import { FormControl } from "@angular/forms";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-captcha",
  templateUrl: "./captcha.component.html",
  styleUrl: "./captcha.component.css",
})
export class CaptchaComponent {
  captcha: string = "";
  captchaString: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  @Input() titleClass = "font-light text-[18px]";
  @Input() control: FormControl | any;
  @Output() focusOutEmit: EventEmitter<string> = new EventEmitter<string>();
  captchaVisible: boolean = true;

  constructor(private messageService: MessageService) {
    this.generateCaptcha();
  }

  generateCaptcha() {
    // randomly generate captcha text from captchaString of length 5
    this.captcha = "";
    for (let i = 0; i < 5; i++) {
      this.captcha += this.captchaString.charAt(Math.floor(Math.random() * this.captchaString.length));
    }
  }

  onFocusOut(event: any): void {
    if (event.target.value === "") {
      // let alertDialogDetails: AlertDetails = {
      //   showErrorIcon: true,
      //   title: "Incorrect Captcha",
      //   message: "Please enter correct captcha",
      //   showOkButton: true,
      //   okButtonLabel: "Ok",
      // };
      // this.alertDialogService.openAlertDialog(alertDialogDetails);
      this.focusOutEmit.emit("");
      return;
    }
    if (event.target.value !== this.captcha) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter correct captcha.",
      });
      // set control value to empty
      this.control.setValue("");
      this.captchaVisible = false;
      setTimeout(() => {
        this.captchaVisible = true;
        this.generateCaptcha();
      }, 10);
    } else {
      this.focusOutEmit.emit(event.target.value);
    }
  }
}

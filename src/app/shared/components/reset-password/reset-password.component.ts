import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { UsersService } from "../../../masters/users/users.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrl: "./reset-password.component.css",
})
export class ResetPasswordComponent implements OnInit {
  usersForm: FormGroup | any;
  constructor(
    public ref: DynamicDialogRef,
    private usersService: UsersService,
    private messageService: MessageService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.usersForm = new FormGroup({
      newPassword: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
    });
  }

  changePassword() {
    this.usersForm.addControl("id", new FormControl(this.config.data.id));
    this.usersService.resetPassword(this.usersForm.value).subscribe((res: any) => {
      if (res.status.toLowerCase() == "success") {
        this.ref.close(res);
      } else {
        this.messageService.add({ severity: "error", summary: res.status, detail: res.message });
      }
    });
  }

  close() {
    this.ref.close("");
  }
}

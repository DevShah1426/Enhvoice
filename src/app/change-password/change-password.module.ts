import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChangePasswordRoutingModule } from "./change-password-routing.module";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ChangePasswordComponent } from "./change-password/change-password.component";

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [CommonModule, ChangePasswordRoutingModule, SharedModule, ReactiveFormsModule],
})
export class ChangePasswordModule {}

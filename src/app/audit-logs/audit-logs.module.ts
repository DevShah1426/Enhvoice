import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuditLogsRoutingModule } from "./audit-logs-routing.module";
import { AuditLogsComponent } from "./audit-logs/audit-logs.component";

import { Icons } from "../../icons";
import { SvgIconComponent, provideSvgIcons } from "@ngneat/svg-icon";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [AuditLogsComponent],
  imports: [CommonModule, SharedModule, AuditLogsRoutingModule, SvgIconComponent, ReactiveFormsModule],
  providers: [provideSvgIcons(Icons)],
})
export class AuditLogsModule {}

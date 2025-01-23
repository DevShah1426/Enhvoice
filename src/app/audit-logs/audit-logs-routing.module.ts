import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuditLogsComponent } from "./audit-logs/audit-logs.component";
import { PermissionGuard } from "../shared/guard/permission.guard";

const routes: Routes = [
  {
    path: "",
    component: AuditLogsComponent,
    canActivate: [PermissionGuard],
    data: { permission: "auditLogs" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditLogsRoutingModule {}

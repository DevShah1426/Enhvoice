import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportComponent } from "./report/report.component";
import { PermissionGuard } from "../shared/guard/permission.guard";

const routes: Routes = [
  {
    path: "",
    component: ReportComponent,
    canActivate: [PermissionGuard],
    data: { permission: "reports" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

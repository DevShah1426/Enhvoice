import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SidenavComponent } from "./sidenav/sidenav.component";

const routes: Routes = [
  {
    path: "",
    component: SidenavComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () => import("../dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "masters",
        loadChildren: () => import("../masters/masters.module").then((m) => m.MastersModule),
      },
      {
        path: "audit-logs",
        loadChildren: () => import("../audit-logs/audit-logs.module").then((m) => m.AuditLogsModule),
      },
      {
        path: "report",
        loadChildren: () => import("../reports/reports.module").then((m) => m.ReportsModule),
      },
      {
        path: "transactions",
        loadChildren: () => import("../transactions/transactions.module").then((m) => m.TransactionsModule),
      },
      {
        path: "help-center",
        loadChildren: () => import("../help-center/help-center.module").then((m) => m.HelpCenterModule),
      },
      {
        path: "settings",
        loadChildren: () => import("../settings/settings.module").then((m) => m.SettingsModule),
      },
      {
        path: "image-editor",
        loadChildren: () => import("../image-editor/image-editor.module").then((m) => m.ImageEditorModule),
      },
      {
        path: "change-password",
        loadChildren: () => import("../change-password/change-password.module").then((m) => m.ChangePasswordModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SidenavRoutingModule {}

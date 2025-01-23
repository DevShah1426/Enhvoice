import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "./shared/guard/auth.guard";

const routes: Routes = [
  { path: "", loadChildren: () => import("./login/login.module").then((m) => m.LoginModule) },
  {
    path: "enhancor",
    loadChildren: () => import("./sidenav/sidenav.module").then((m) => m.SidenavModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

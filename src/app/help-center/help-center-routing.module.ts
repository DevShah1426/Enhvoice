import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HelpCenterComponent } from "./help-center/help-center.component";

const routes: Routes = [
  {
    path: "",
    component: HelpCenterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpCenterRoutingModule {}

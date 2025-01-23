import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HelpCenterRoutingModule } from "./help-center-routing.module";
import { HelpCenterComponent } from "./help-center/help-center.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [HelpCenterComponent],
  imports: [CommonModule, HelpCenterRoutingModule, SharedModule],
})
export class HelpCenterModule {}

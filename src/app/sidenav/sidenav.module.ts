import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SidenavRoutingModule } from "./sidenav-routing.module";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { SvgIconComponent, provideSvgIcons } from "@ngneat/svg-icon";
import { Icons } from "../../icons";

@NgModule({
  declarations: [SidenavComponent],
  imports: [CommonModule, SidenavRoutingModule, SvgIconComponent],
  providers: [provideSvgIcons(Icons)],
})
export class SidenavModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsRoutingModule } from "./reports-routing.module";
import { ReportComponent } from "./report/report.component";
import { SharedModule } from "../shared/shared.module";
import { SvgIconComponent, provideSvgIcons } from "@ngneat/svg-icon";
import { ReactiveFormsModule } from "@angular/forms";
import { Icons } from "../../icons";
import { ReportFilterComponent } from './report-filter/report-filter.component';

@NgModule({
  declarations: [ReportComponent, ReportFilterComponent],
  imports: [CommonModule, SharedModule, ReportsRoutingModule, SvgIconComponent, ReactiveFormsModule],
  providers: [provideSvgIcons(Icons)],
})
export class ReportsModule {}

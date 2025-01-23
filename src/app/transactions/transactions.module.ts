import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TransactionsRoutingModule } from "./transactions-routing.module";
import { TransactionsComponent } from "./transactions/transactions.component";
import { RecentUploadsComponent } from "./transactions/recent-uploads/recent-uploads.component";
import { UploadedFoldersComponent } from "./transactions/uploaded-folders/uploaded-folders.component";
import { Icons } from "../../icons";
import { SvgIconComponent, provideSvgIcons } from "@ngneat/svg-icon";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { FolderWiseFilesComponent } from "./folder-wise-files/folder-wise-files.component";
import { UploadFilesComponent } from "./upload-files/upload-files.component";
import { TemplateSelectionComponent } from "./template-selection/template-selection.component";
import { ResultComponent } from "./result/result.component";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { DynamicResultFormComponent } from "./result/dynamic-result-form/dynamic-result-form.component";
import { TransactionFilterComponent } from "./transactions/transaction-filter/transaction-filter.component";
import { BatchwiseFilterComponent } from "./transactions/batchwise-filter/batchwise-filter.component";
import { PropertywiseFilterComponent } from "./transactions/propertywise-filter/propertywise-filter.component";

@NgModule({
  declarations: [
    TransactionsComponent,
    RecentUploadsComponent,
    UploadedFoldersComponent,
    FolderWiseFilesComponent,
    UploadFilesComponent,
    TemplateSelectionComponent,
    ResultComponent,
    DynamicResultFormComponent,
    TransactionFilterComponent,
    BatchwiseFilterComponent,
    PropertywiseFilterComponent,
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    SvgIconComponent,
    ReactiveFormsModule,
    SharedModule,
    OverlayPanelModule,
  ],
  providers: [provideSvgIcons(Icons)],
})
export class TransactionsModule {}

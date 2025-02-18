import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MastersRoutingModule } from "./masters-routing.module";
import { PropertyComponent } from "./property/property.component";
import { SharedModule } from "../shared/shared.module";
import { AddEditPropertyComponent } from "./property/add-edit-property/add-edit-property.component";
import { SvgIconComponent, provideSvgIcons } from "@ngneat/svg-icon";
import { Icons } from "../../icons";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { UsergroupsComponent } from "./usergroups/usergroups.component";
import { AddEditUsergroupComponent } from "./usergroups/add-edit-usergroup/add-edit-usergroup.component";
import { InputSwitchModule } from "primeng/inputswitch";
import { UsersComponent } from "./users/users.component";
import { AddEditUsersComponent } from "./users/add-edit-users/add-edit-users.component";
import { GroupComponent } from "./group/group.component";
import { AddEditGroupComponent } from "./group/add-edit-group/add-edit-group.component";
import { UtilityComponent } from "./utility/utility.component";
import { AddEditUtilityComponent } from "./utility/add-edit-utility/add-edit-utility.component";
import { ProviderComponent } from "./provider/provider.component";
import { AddEditProviderComponent } from "./provider/add-edit-provider/add-edit-provider.component";
import { AddEditAccountNumbersComponent } from "./property/add-edit-account-numbers/add-edit-account-numbers.component";
import { TemplateComponent } from './template/template.component';
import { AddEditTemplateComponent } from './template/add-edit-template/add-edit-template.component';
import { PdfSplitterComponent } from './pdf-splitter/pdf-splitter.component';

@NgModule({
  declarations: [
    PropertyComponent,
    AddEditPropertyComponent,
    UsergroupsComponent,
    AddEditUsergroupComponent,
    UsersComponent,
    AddEditUsersComponent,
    GroupComponent,
    AddEditGroupComponent,
    UtilityComponent,
    AddEditUtilityComponent,
    ProviderComponent,
    AddEditProviderComponent,
    AddEditAccountNumbersComponent,
    TemplateComponent,
    AddEditTemplateComponent,
    PdfSplitterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MastersRoutingModule,
    SvgIconComponent,
    ReactiveFormsModule,
    ToastModule,
    InputSwitchModule,
    FormsModule,
  ],
  providers: [provideSvgIcons(Icons)],
})
export class MastersModule {}

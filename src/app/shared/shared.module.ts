import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "./components/button/button.component";
import { InputComponent } from "./components/input/input.component";

import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";

import { CaptchaComponent } from "./components/captcha/captcha.component";
import { AlertComponent } from "./components/alert/alert.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "./components/header/header.component";
import { Icons } from "../../icons";
import { SvgIconComponent, provideSvgIcons } from "@ngneat/svg-icon";
import { TitleCardComponent } from "./components/title-card/title-card.component";
import { TableComponent } from "./components/table/table.component";
import { SearchInputComponent } from "./components/search-input/search-input.component";
import { ToastModule } from "primeng/toast";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { DropdownModule } from "primeng/dropdown";
import { MenuButtonComponent } from "./components/menu-button/menu-button.component";
import { MenuModule } from "primeng/menu";
import { PdfViewerComponent } from "./components/pdf-viewer/pdf-viewer.component";
import { DatepickerComponent } from "./components/datepicker/datepicker.component";
import { CalendarModule } from "primeng/calendar";
import { ComingSoonComponent } from "./components/coming-soon/coming-soon.component";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ToggleSwitchComponent } from "./components/toggle-switch/toggle-switch.component";
import { InputSwitchModule } from "primeng/inputswitch";
import { CheckboxComponent } from "./components/checkbox/checkbox.component";
import { CheckboxModule } from "primeng/checkbox";
import { SelectButtonComponent } from "./components/select-button/select-button.component";
import { SelectButtonModule } from "primeng/selectbutton";
import { HasPermissionDirective } from "./directives/has-permission.directive";
import { NoPermissionComponent } from "./components/no-permission/no-permission.component";
import { MultiselectDropdownComponent } from "./components/multiselect-dropdown/multiselect-dropdown.component";
import { MultiSelectModule } from "primeng/multiselect";
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    CaptchaComponent,
    AlertComponent,
    HeaderComponent,
    TitleCardComponent,
    TableComponent,
    SearchInputComponent,
    DropdownComponent,
    MenuButtonComponent,
    PdfViewerComponent,
    DatepickerComponent,
    ComingSoonComponent,
    ToggleSwitchComponent,
    CheckboxComponent,
    SelectButtonComponent,
    HasPermissionDirective,
    NoPermissionComponent,
    MultiselectDropdownComponent,
    ResetPasswordComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DynamicDialogModule,
    TableModule,
    ButtonModule,
    ToastModule,
    DropdownModule,
    MenuModule,
    SvgIconComponent,
    CalendarModule,
    OverlayPanelModule,
    InputSwitchModule,
    CheckboxModule,
    SelectButtonModule,
    MultiSelectModule,
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    CaptchaComponent,
    HeaderComponent,
    TitleCardComponent,
    TableComponent,
    SearchInputComponent,
    DropdownComponent,
    MenuButtonComponent,
    PdfViewerComponent,
    DatepickerComponent,
    ComingSoonComponent,
    ToggleSwitchComponent,
    CheckboxComponent,
    SelectButtonComponent,
    NoPermissionComponent,
    HasPermissionDirective,
    MultiselectDropdownComponent,
  ],
  providers: [provideSvgIcons(Icons), DialogService],
})
export class SharedModule {}

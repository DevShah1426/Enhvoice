import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PropertyComponent } from "./property/property.component";
import { UsergroupsComponent } from "./usergroups/usergroups.component";
import { UsersComponent } from "./users/users.component";
import { GroupComponent } from "./group/group.component";
import { UtilityComponent } from "./utility/utility.component";
import { ProviderComponent } from "./provider/provider.component";
import { PermissionGuard } from "../shared/guard/permission.guard";
import { TemplateComponent } from "./template/template.component";

const routes: Routes = [
  {
    path: "",
    component: PropertyComponent,
    canActivate: [PermissionGuard],
    data: { permission: "viewProperty" },
  },
  {
    path: "user-groups",
    component: UsergroupsComponent,
    canActivate: [PermissionGuard],
    data: { permission: "viewUserGroup" },
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [PermissionGuard],
    data: { permission: "viewUsers" },
  },
  {
    path: "groups",
    component: GroupComponent,
    canActivate: [PermissionGuard],
    data: { permission: "viewPropertyGroup" },
  },
  {
    path: "utilities",
    component: UtilityComponent,
    canActivate: [PermissionGuard],
    data: { permission: "viewUtilities" },
  },
  {
    path: "providers",
    component: ProviderComponent,
    canActivate: [PermissionGuard],
    data: { permission: "viewProvider" },
  },
  {
    path: "template",
    component: TemplateComponent,
    canActivate: [PermissionGuard],
    data: { permission: "viewTemplate" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastersRoutingModule {}

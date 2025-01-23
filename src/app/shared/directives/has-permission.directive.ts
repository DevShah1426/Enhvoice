import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { PermissionService } from "../services/permission.service";

@Directive({
  selector: "[appHasPermission]",
})
export class HasPermissionDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  @Input() set appHasPermission(permissionKey: string) {
    if (this.permissionService.hasPermission(permissionKey)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

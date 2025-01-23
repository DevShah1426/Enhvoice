import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { PermissionService } from "../services/permission.service";

@Injectable({
  providedIn: "root",
})
export class PermissionGuard implements CanActivate {
  constructor(private router: Router, private permissionService: PermissionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredPermission = route.data["permission"]; // Get required permission from route data

    // Check if user has the required permission
    if (requiredPermission && !this.permissionService.hasPermission(requiredPermission)) {
      this.router.navigate(["/enhancor/transactions"]); // Redirect to home if no permission
      return false;
    }

    return true; // User has permission, allow access
  }
}

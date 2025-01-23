import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PermissionService {
  private permissions: { [key: string]: boolean } = {};
  private readonly STORAGE_KEY = "userPermissions";

  constructor() {
    this.loadPermissions();
  }

  // Load permissions from localStorage
  private loadPermissions() {
    const storedPermissions = localStorage.getItem(this.STORAGE_KEY);
    if (storedPermissions) {
      this.permissions = JSON.parse(storedPermissions);
    }
  }

  // Set permissions received from API and store them in localStorage
  setPermissions(receivedPermissions: { [key: string]: boolean }) {
    this.permissions = receivedPermissions;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.permissions));
  }

  // Check if the user has a specific permission
  hasPermission(permissionKey: string): boolean {
    return !!this.permissions[permissionKey];
  }
}

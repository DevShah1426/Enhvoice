import { AfterViewInit, Component, ElementRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { LoginService } from "../../login/login/login.service";
import { PermissionService } from "../../shared/services/permission.service";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrl: "./sidenav.component.css",
})
export class SidenavComponent {
  isFormVisible: boolean = false;
  isSidebarVisible: boolean = true;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private el: ElementRef,
    private loginService: LoginService,
    private permissionService: PermissionService
  ) {
    this.setActiveRoute({ routerLink: router.url });
  }
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  menuItems: any[] = [
    {
      name: "Dashboard",
      icon: "transactions",
      routerLink: "/enhancor/transactions",
      visible: true,
    },
    {
      name: "Masters",
      icon: "masters",
      expandable: true,
      children: [
        {
          name: "Property",
          icon: "user-groups",
          expanded: false,
          routerLink: "/enhancor/masters/groups",
          visible: this.permissionService.hasPermission("viewPropertyGroup"),
        },
        {
          name: "Service Address",
          routerLink: "/enhancor/masters",
          icon: "property",
          expanded: false,
          visible: this.permissionService.hasPermission("viewProperty"),
        },
        {
          name: "Users",
          icon: "users",
          expanded: false,
          routerLink: "/enhancor/masters/users",
          visible: this.permissionService.hasPermission("viewUsers"),
        },
        {
          name: "User Groups",
          icon: "user-groups",
          expanded: false,
          routerLink: "/enhancor/masters/user-groups",
          visible: this.permissionService.hasPermission("viewUserGroup"),
        },
        {
          name: "Template Creation",
          routerLink: "/enhancor/image-editor",
          icon: "property",
          expanded: false,
          visible: this.permissionService.hasPermission("template"),
        },
        {
          name: "Template",
          routerLink: "/enhancor/masters/template",
          icon: "property",
          expanded: false,
          visible: this.permissionService.hasPermission("viewTemplate"),
        },
        {
          name: "Utilities",
          routerLink: "/enhancor/masters/utilities",
          icon: "property",
          expanded: false,
          visible: this.permissionService.hasPermission("viewUtilities"),
        },
        {
          name: "Provider",
          routerLink: "/enhancor/masters/providers",
          icon: "property",
          expanded: false,
          visible: this.permissionService.hasPermission("viewProvider"),
        },
      ],
    },
    {
      name: "Audit Logs",
      icon: "auditlogs",
      routerLink: "/enhancor/audit-logs",
      visible: this.permissionService.hasPermission("auditLogs"),
    },
    {
      name: "Reports",
      icon: "reports",
      routerLink: "/enhancor/report",
      visible: this.permissionService.hasPermission("reports"),
    },
    {
      name: "Change Password",
      icon: "password",
      routerLink: "/enhancor/change-password",
      visible: true,
    },
    {
      isBlank: true,
    },
    {
      name: "Help Centre",
      icon: "help",
      routerLink: "/enhancor/help-center",
      visible: true,
    },
    {
      name: "Settings",
      icon: "settings",
      routerLink: "/enhancor/settings",
      visible: true,
    },
    {
      name: "Logout",
      icon: "logout",
      routerLink: "/",
      visible: true,
    },
  ];

  activeRoute: any = "";
  setActiveRoute(menu: any) {
    if (menu.name == "Logout") {
      localStorage.clear();
      sessionStorage.clear();
      this.loginService.setAuthentication(false);
      this.router.navigate(["/"]);
      return;
    }
    this.activeRoute = menu.routerLink;
  }

  toggleContent(event: Event) {
    const element = event.currentTarget as HTMLElement;
    element.classList.toggle("expand");
    const content: any = element.nextElementSibling as HTMLElement;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = "fit-content";
    }
  }
}

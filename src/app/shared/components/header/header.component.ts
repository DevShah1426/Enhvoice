import { Component } from "@angular/core";
import { HeaderService } from "../../services/header.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { NotificationsService } from "../../services/notifications.service";

export interface Notification {
  sendUserId: Number;
  email: string;
  notificationMessage: string;
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  title: any = "";
  icon: any = "";
  usrName = localStorage.getItem("usrName");
  usrFullName = localStorage.getItem("userFullName");

  notifications: Notification[] = [];

  constructor(
    private headerService: HeaderService,
    private sanitizer: DomSanitizer,
    private notificationsService: NotificationsService
  ) {
    this.headerService.headerTitle$.subscribe((title) => {
      this.title = title.title;
      this.icon = title.icon;
    });
  }

  getAllNotifications(event: Event, op: any) {
    this.notificationsService.getAllNotifications().subscribe(
      (res: any) => {
        this.notifications = res.notificationDao; // Update notifications with the response data
        op.toggle(event);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
      }
    );
  }
}

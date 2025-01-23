import { Component } from "@angular/core";
import { HeaderService } from "../../shared/services/header.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {
  constructor(private headerService: HeaderService) {
    headerService.updateHeader({
      title: "Dashboard",
      icon: "dashboard",
    });
  }
}

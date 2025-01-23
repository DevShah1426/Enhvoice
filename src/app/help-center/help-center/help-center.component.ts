import { Component } from "@angular/core";
import { HeaderService } from "../../shared/services/header.service";

@Component({
  selector: "app-help-center",
  templateUrl: "./help-center.component.html",
  styleUrl: "./help-center.component.css",
})
export class HelpCenterComponent {
  constructor(private headerService: HeaderService) {
    headerService.updateHeader({
      title: "Help Centre",
      icon: "help",
    });
  }
}

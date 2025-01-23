import { Component } from "@angular/core";
import { HeaderService } from "../../shared/services/header.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.css",
})
export class SettingsComponent {
  constructor(private headerService: HeaderService) {
    headerService.updateHeader({
      title: "Settings",
      icon: "settings",
    });
  }
}

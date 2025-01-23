import { Component, Input } from "@angular/core";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-menu-button",
  templateUrl: "./menu-button.component.html",
  styleUrl: "./menu-button.component.css",
})
export class MenuButtonComponent {
  @Input() items: MenuItem[] | undefined;
  @Input() label: string = "";
  @Input() disabled: boolean = false;
  @Input() icon: string = "";
  @Input() buttonClass: string = "";
  @Input() buttonHeight: string = "";
}

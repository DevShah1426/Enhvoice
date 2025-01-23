import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.css",
})
export class ButtonComponent {
  @Input() label: string = "";
  @Input() disabled: boolean = false;
  @Input() icon: string = "";
  @Input() buttonClass: string = "";
  @Output() onClick = new EventEmitter<string>();

  onButtonClick() {
    this.onClick.emit();
  }
}

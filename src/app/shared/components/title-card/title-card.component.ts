import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-title-card",
  templateUrl: "./title-card.component.html",
  styleUrl: "./title-card.component.css",
})
export class TitleCardComponent {
  @Input() title: string = "";
  @Input() description: string = "";
  @Input() showButton: boolean = false;
  @Input() buttonLabel: string = "";
  @Input() buttonIcon: string = "";
  @Output() emitButtonClick = new EventEmitter();

  onClick() {
    this.emitButtonClick.emit();
  }
}

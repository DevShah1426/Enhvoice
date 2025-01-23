import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-toggle-switch",
  templateUrl: "./toggle-switch.component.html",
  styleUrl: "./toggle-switch.component.css",
})
export class ToggleSwitchComponent implements OnInit {
  @Input() checked: FormControl | any;
  @Input() inputLabel: string = "";
  @Input() labelClass: string = "";
  @Output() checkedChange: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.checked = new FormControl(true);
  }

  onChange(event: any) {
    this.checkedChange.emit(event.checked);
  }
}

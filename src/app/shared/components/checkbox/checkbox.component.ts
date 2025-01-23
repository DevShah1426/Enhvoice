import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrl: "./checkbox.component.css",
})
export class CheckboxComponent implements OnInit {
  @Input() label: string = "";
  @Input() disabled: boolean = false;
  @Output() onCheckBoxValueChange: EventEmitter<any> = new EventEmitter<any>();
  checked: boolean = false;

  ngOnInit() {}

  checkboxChecked(event: any) {
    this.onCheckBoxValueChange.emit(event);
  }
}

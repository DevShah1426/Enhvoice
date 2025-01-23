import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrl: "./input.component.css",
})
export class InputComponent {
  @Input() inputLabel: string = "";
  @Input() inputPlaceholder: string = "";
  @Input() inputHelpText: string = "";
  @Input() inputClass: string = "";
  @Input() labelClass: string = "";
  @Input() inputType: string = "text";
  @Input() control: FormControl | any;
  @Input() readOnly: boolean = false;
  @Input() showAddIcon: boolean = false;
  @Input() showRemoveIcon: boolean = false;
  @Output() addInput: EventEmitter<any> = new EventEmitter();
  @Output() removeInput: EventEmitter<any> = new EventEmitter();

  constructor() {}

  addRecord(control: any) {
    this.addInput.emit(control);
  }

  removeRecord(inputLabel: any) {
    this.removeInput.emit(inputLabel);
  }
}

import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-datepicker",
  templateUrl: "./datepicker.component.html",
  styleUrl: "./datepicker.component.css",
})
export class DatepickerComponent {
  @Input() inputLabel: string = "";
  @Input() inputPlaceholder: string = "";
  @Input() inputHelpText: string = "";
  @Input() inputClass: string = "";
  @Input() labelClass: string = "";
  @Input() inputType: string = "text";
  @Input() control: FormControl | any;
  @Input() maxDate: any = null;
  @Input() minDate: any = null;
  @Output() onDateChange = new EventEmitter<any>();

  constructor() {}

  onDateChangeHandler(event: any) {
    this.onDateChange.emit(event);
  }
}

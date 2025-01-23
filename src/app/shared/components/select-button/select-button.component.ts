import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-select-button",
  templateUrl: "./select-button.component.html",
  styleUrl: "./select-button.component.css",
})
export class SelectButtonComponent {
  formGroup!: FormGroup | any;

  @Input() options: any[] = [];
  @Input() value: any = "";
  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.formGroup = new FormGroup({
      value: new FormControl(this.options[0].value),
    });

    if (this.value) {
      this.formGroup.get("value").setValue(this.value);
    }
  }

  onChange(event: any) {
    this.onSelectionChange.emit(event.value);
  }
}

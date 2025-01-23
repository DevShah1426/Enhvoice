import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrl: "./dropdown.component.css",
})
export class DropdownComponent {
  @Input() dropdownItems: any[] = [];
  @Input() dropdownLabel: string = "Test";
  @Input() dropdownLabelClass: string = "form-dropdown-label";
  @Input() dropdownClass: string = "";
  @Input() control: FormControl | any;
  @Input() optionLabel: string = "label";
  @Input() selectedItem: any = null;
  @Input() disabled: boolean = false;
  @Output() onSelect = new EventEmitter<any>();

  onChange(event: any) {
    this.onSelect.emit(event);
  }
}

import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-multiselect-dropdown",
  templateUrl: "./multiselect-dropdown.component.html",
  styleUrl: "./multiselect-dropdown.component.css",
})
export class MultiselectDropdownComponent {
  @Input() dropdownItems: any[] = [];
  @Input() dropdownLabel: string = "Test";
  @Input() dropdownLabelClass: string = "form-dropdown-label";
  @Input() dropdownClass: string = "";
  @Input() control: FormControl | any;
  @Input() optionLabel: string = "label";
  @Input() selectedItem: any = null;
  @Output() onSelect = new EventEmitter<any>();

  onChange(event: any) {
    this.onSelect.emit(event);
  }
}

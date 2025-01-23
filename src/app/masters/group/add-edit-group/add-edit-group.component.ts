import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { GroupService } from "../group.service";

@Component({
  selector: "app-add-edit-group",
  templateUrl: "./add-edit-group.component.html",
  styleUrl: "./add-edit-group.component.css",
})
export class AddEditGroupComponent {
  groupForm: FormGroup | any;
  buttonLabel: string = "Add Property";
  constructor(
    public ref: DynamicDialogRef,
    private groupService: GroupService,
    private messageService: MessageService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.groupForm = new FormGroup({
      propertyGroupName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      propertyYardyId: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      country: new FormControl({ value: "USA", disabled: true }),
      state: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
    });
    if (this.config.data) {
      this.buttonLabel = "Edit Property";
      this.groupForm.patchValue(this.config.data);
      this.groupForm.addControl("id", new FormControl(this.config.data.id));
      this.groupForm.addControl("activeFlag", new FormControl(this.config.data.activeFlag));
    }
  }

  getFormattedData() {
    // trim the spaces
    this.groupForm.value.propertyGroupName = this.groupForm.value.propertyGroupName.trim();
    this.groupForm.value.propertyYardyId = this.groupForm.value.propertyYardyId.trim();
    this.groupForm.value.state = this.groupForm.value.state.trim();
    this.groupForm.value.city = this.groupForm.value.city.trim();

    // if length of any field is 0 after trim then set value to empty
    if (this.groupForm.value.propertyGroupName.length == 0) {
      this.groupForm.get("propertyGroupName").setValue("");
    }
    if (this.groupForm.value.propertyYardyId.length == 0) {
      this.groupForm.get("propertyYardyId").setValue("");
    }
    if (this.groupForm.value.state.length == 0) {
      this.groupForm.get("state").setValue("");
    }
    if (this.groupForm.value.city.length == 0) {
      this.groupForm.get("city").setValue("");
    }

    // check if form is valid
    if (!this.groupForm.valid) {
      return;
    }

    const formValue = this.groupForm.value;
    const formattedData = {
      ...formValue,
    };
    return formattedData;
  }

  addGroup() {
    const formattedData = this.getFormattedData();
    formattedData.country = "USA";
    this.groupService.saveGroups(formattedData).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() == "success") {
          this.ref.close(res);
        } else {
          this.messageService.add({ severity: "error", summary: res.status, detail: res.message });
        }
      },
      (err: any) => {
        this.ref.close("failed");
      }
    );
  }

  close() {
    this.ref.close("");
  }
}

import { Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { UtilityService } from "../utility.service";
import { MessageService } from "primeng/api";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-add-edit-utility",
  templateUrl: "./add-edit-utility.component.html",
  styleUrl: "./add-edit-utility.component.css",
})
export class AddEditUtilityComponent {
  utilitiesForm: FormGroup | any;
  userGroups: any[] = [];
  buttonLabel: string = "Add Utility";

  constructor(
    public ref: DynamicDialogRef,
    private utilityService: UtilityService,
    private messageService: MessageService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.utilitiesForm = new FormGroup({
      utilityName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      glCode: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
    });

    if (this.config.data) {
      this.buttonLabel = "Edit Utility";
      this.utilitiesForm.patchValue(this.config.data);
      this.utilitiesForm.addControl("id", new FormControl(this.config.data.id));
      this.utilitiesForm.addControl("activeFlag", new FormControl(this.config.data.activeFlag));
    }
  }

  addUtility() {
    // trim the spaces
    this.utilitiesForm.value.utilityName = this.utilitiesForm.value.utilityName.trim();
    this.utilitiesForm.value.glCode = this.utilitiesForm.value.glCode.trim();
    // if length of any field is 0 after trim then set value to empty
    if (this.utilitiesForm.value.utilityName.length == 0) {
      this.utilitiesForm.get("utilityName").setValue("");
    }
    if (this.utilitiesForm.value.glCode.length == 0) {
      this.utilitiesForm.get("glCode").setValue("");
    }
    // check if form is valid
    if (!this.utilitiesForm.valid) {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Utility Name and GL Code are required" });
      return;
    }
    this.utilityService.saveUtilities(this.utilitiesForm.value).subscribe((res: any) => {
      if (res.status.toLowerCase() == "success") {
        this.ref.close(res);
      } else {
        this.messageService.add({ severity: "error", summary: res.status, detail: res.message });
      }
    });
  }

  close() {
    this.ref.close("");
  }
}

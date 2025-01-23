import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { PropertyService } from "../property.service";
import { GroupService } from "../../group/group.service";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-add-edit-property",
  templateUrl: "./add-edit-property.component.html",
  styleUrl: "./add-edit-property.component.css",
})
export class AddEditPropertyComponent implements OnInit {
  propertyForm: FormGroup | any;
  groups: any[] = [];
  buttonLabel: string = "Add Service Address";
  showGasAccountNo2: boolean = false;
  showWaterAccountNo2: boolean = false;
  showElectricityAccountNo2: boolean = false;

  showGasAccountNo3: boolean = false;
  showWaterAccountNo3: boolean = false;
  showElectricityAccountNo3: boolean = false;

  showGasAccountNo4: boolean = false;
  showWaterAccountNo4: boolean = false;
  showElectricityAccountNo4: boolean = false;

  showGasAccountNo5: boolean = false;
  showWaterAccountNo5: boolean = false;
  showElectricityAccountNo5: boolean = false;

  selectedGroup: any = null;
  constructor(
    public ref: DynamicDialogRef,
    private propertyService: PropertyService,
    private groupService: GroupService,
    private toastService: ToastService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getAllGroups();
    this.propertyForm = new FormGroup({
      pgId: new FormControl("", [Validators.required]),
      serviceBlockFullAddress: new FormControl("", [Validators.required]),
      archiveYn: new FormControl("N"),
    });
  }

  getAllGroups() {
    this.groups = [];
    this.groupService.getAllNotArchivedGroups().subscribe((res: any) => {
      this.groups = res;
      if (this.config.data) {
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i].id == this.config.data.pgId) {
            this.propertyForm.get("pgId").setValue(this.groups[i].id);
            this.selectedGroup = this.groups[i];
          }
        }
        this.buttonLabel = "Edit Service Address";
        this.propertyForm.patchValue(this.config.data);
        this.propertyForm.addControl("id", new FormControl(this.config.data.id));
        this.propertyForm.addControl("activeFlag", new FormControl(this.config.data.activeFlag));
        this.propertyForm.addControl("archiveYn", new FormControl(this.config.data.archiveYn));
      }
    });
  }

  onSelect(event: any) {
    this.propertyForm.get("pgId").setValue(event.value.id);
  }

  addProperty() {
    // trim the spaces for serviceBlockFullAddress
    this.propertyForm.value.serviceBlockFullAddress = this.propertyForm.value.serviceBlockFullAddress.trim();
    if (
      this.propertyForm.value.serviceBlockFullAddress == "" ||
      this.propertyForm.value.serviceBlockFullAddress == null
    ) {
      this.toastService.showWarning("Service Block Full Address is required.", "Warning");
      this.propertyForm.get("serviceBlockFullAddress").setValue("");
      return;
    }
    this.propertyService.saveProperty(this.propertyForm.value).subscribe((res: any) => {
      if (res.status.toLowerCase() == "success") {
        this.ref.close(res);
      } else {
        this.toastService.showError(res.message, res.status);
      }
    });
  }

  close() {
    this.ref.close("");
  }
}

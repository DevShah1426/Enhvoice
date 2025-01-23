import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ProviderService } from "../provider.service";

@Component({
  selector: "app-add-edit-provider",
  templateUrl: "./add-edit-provider.component.html",
  styleUrl: "./add-edit-provider.component.css",
})
export class AddEditProviderComponent {
  providersForm: FormGroup | any;
  buttonLabel: string = "Add Provider";
  constructor(
    public ref: DynamicDialogRef,
    private providerService: ProviderService,
    private messageService: MessageService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.providersForm = new FormGroup({
      providerName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      code: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    });
    if (this.config.data) {
      this.buttonLabel = "Edit Provider";
      this.providersForm.patchValue(this.config.data);
      this.providersForm.addControl("id", new FormControl(this.config.data.id));
      this.providersForm.addControl("activeFlag", new FormControl(this.config.data.activeFlag));
    }
  }

  addProvider() {
    // trim the spaces
    this.providersForm.value.providerName = this.providersForm.value.providerName.trim();
    this.providersForm.value.code = this.providersForm.value.code.trim();
    // if length of any field is 0 after trim then set value to empty
    if (this.providersForm.value.providerName.length == 0) {
      this.providersForm.get("providerName").setValue("");
    }
    if (this.providersForm.value.code.length == 0) {
      this.providersForm.get("code").setValue("");
    }
    // check if form is valid
    if (!this.providersForm.valid) {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Provider Name and Code are required" });
      return;
    }
    this.providerService.saveProvider(this.providersForm.value).subscribe((res: any) => {
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

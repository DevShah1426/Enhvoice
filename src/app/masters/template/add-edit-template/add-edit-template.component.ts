import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToastService } from "../../../shared/services/toast.service";
import { GroupService } from "../../group/group.service";
import { TemplateService } from "../template.service";

@Component({
  selector: "app-add-edit-template",
  templateUrl: "./add-edit-template.component.html",
  styleUrl: "./add-edit-template.component.css",
})
export class AddEditTemplateComponent implements OnInit {
  form: FormGroup;
  properties: any[] = []; // Store dropdown options
  selectedProperty: any = null;
  hasPreviousData: boolean = false;
  accountNumberCounter: number = 0;
  constructor(
    private fb: FormBuilder,
    private templateService: TemplateService,
    private groupService: GroupService,
    protected config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      rows: this.fb.array([]), // FormArray to hold rows
    });
  }

  ngOnInit(): void {
    this.fetchDropdownOptions(); // Fetch options on load
    this.addNewRow(); // Add default row
  }

  close() {
    this.ref.close(this.accountNumberCounter);
  }

  getAll() {
    this.hasPreviousData = false;
    // clear previous data
    this.rows.clear();
    this.templateService.getAllByTemplateId(this.config.data.id).subscribe((res: any) => {
      let data = res.ocrTemplatePropertiesDao;
      // set data to form array
      if (data.length > 0) {
        this.hasPreviousData = true;
        for (let i = 0; i < data.length; i++) {
          this.rows.push(this.createRow());
          this.rows.at(i).get("pgId")?.setValue({
            pgId: data[i].pgId,
            propertyGroupName: data[i].propertyGroupName,
            activeFlag: "Y",
            glCode: null,
          });
          this.rows.at(i).get("isSaved")?.setValue(true);
          this.rows.at(i).get("hasPreviousData")?.setValue(true);
          this.rows.at(i).get("id")?.setValue(data[i].id);
        }
      } else {
        this.hasPreviousData = false;
      }
    });
  }

  // Getter for rows FormArray
  get rows(): FormArray {
    return this.form.get("rows") as FormArray;
  }

  onPropertySelect(event: any, i: any) {
    this.rows.at(i).get("pgId")?.setValue(event.id);
  }

  // Function to create a row with dropdown, textbox, and isSaved flag
  createRow(): FormGroup {
    return this.fb.group({
      pgId: ["", Validators.required], // Dropdown field
      isSaved: [false], // Flag to track if row is saved
      hasPreviousData: [false],
      id: [0],
    });
  }

  // Function to add a new row
  addNewRow(): void {
    if (this.rows.length < 150) {
      this.rows.push(this.createRow());
    }
  }

  isEditClicked: boolean = false;
  editRow(index: number): void {
    if (this.isEditClicked) return;
    this.isEditClicked = true;

    for (let i = 0; i < this.properties.length; i++) {
      if (this.properties[i].id == this.rows.at(index).value.pgId.pgId) {
        this.rows.at(index).get("pgId")?.setValue(this.properties[i]);
        this.selectedProperty = this.rows.at(index).value.pgId;
      }
    }
    this.rows.at(index).get("isSaved")?.setValue(false); // Mark the row as editable
  }

  // Function to delete a row
  deleteRow(index: number): void {
    this.isEditClicked = false;
    this.templateService.deleteTemplateProperty({ id: this.rows.at(index).value.id }).subscribe((res: any) => {
      if (res.status.toLowerCase() == "success") {
        this.rows.removeAt(index);
        this.toastService.showSuccess(res.message, res.status);
        this.getAll();
      } else {
        this.toastService.showError(res.message, res.status);
      }
    });
  }

  // Function to fetch dropdown options from API
  fetchDropdownOptions(): void {
    this.groupService.getAllNotArchivedGroups().subscribe(
      (response: any) => {
        this.properties = response; // Assign response to dropdownOptions
        this.getAll();
      },
      (error) => {
        console.error("Error fetching dropdown options:", error);
      }
    );
  }

  // Function to save a row
  saveRow(index: number): void {
    this.isEditClicked = false;
    let rowId: any = "";
    if (this.selectedProperty != null) {
      rowId = this.selectedProperty.id;
    }
    const rowData = this.rows.at(index).value; // Get data from the row

    let payload: any = {
      pgId: rowData.pgId.id ? rowData.pgId.id : rowData.pgId,
      templateId: this.config.data.id,
      activeFlag: "Y",
    };
    if (this.hasPreviousData && rowData.id > 0) {
      payload["id"] = rowData.id;
    }
    if (payload.pgId == "" || payload.pgId == null || payload.pgId == undefined) {
      this.toastService.showError("Property is required", "Error");
      return;
    }
    this.accountNumberCounter++;
    this.templateService.save(payload).subscribe(
      (response: any) => {
        if (response.status.toLowerCase() == "success") {
          this.toastService.showSuccess(response.message, "Success");
          this.rows.at(index).get("isSaved")?.setValue(true); // Mark the row as saved
          this.selectedProperty = null;
          this.getAll();
        } else {
          this.toastService.showError(response.message, "Error");
        }
      },
      (error: any) => {
        console.error("Error saving row:", error);
      }
    );
  }
}

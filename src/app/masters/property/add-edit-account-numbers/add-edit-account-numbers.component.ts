import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "../../utility/utility.service";
import { PropertyService } from "../property.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-add-edit-account-numbers",
  templateUrl: "./add-edit-account-numbers.component.html",
  styleUrl: "./add-edit-account-numbers.component.css",
})
export class AddEditAccountNumbersComponent implements OnInit {
  form: FormGroup;
  utilities: any[] = []; // Store dropdown options
  selectedUtility: any = null;
  hasPreviousData: boolean = false;
  accountNumberCounter: number = 0;
  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private propertyService: PropertyService,
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
    this.getAll();
  }

  close() {
    this.ref.close(this.accountNumberCounter);
  }

  getAll() {
    this.hasPreviousData = false;
    // clear previous data
    this.rows.clear();
    this.propertyService.getAllAccountNumber(this.config.data.id).subscribe((res: any) => {
      let data = res.accountNumberDaos;
      // set data to form array
      if (data.length > 0) {
        this.hasPreviousData = true;
        for (let i = 0; i < data.length; i++) {
          this.rows.push(this.createRow());
          this.rows
            .at(i)
            .get("utilityId")
            ?.setValue({ id: data[i].utilityId, utilityName: data[i].utilityName, activeFlag: "Y", glCode: null });
          this.rows.at(i).get("accountNumber")?.setValue(data[i].accountNumber);
          this.rows.at(i).get("isSaved")?.setValue(true);
          this.rows.at(i).get("hasPreviousData")?.setValue(true);
          this.rows.at(i).get("id")?.setValue(data[i].id);
        }
        // remove last row
        // this.rows.removeAt(this.rows.length - 1);
      } else {
        this.hasPreviousData = false;
      }
    });
  }

  // Getter for rows FormArray
  get rows(): FormArray {
    return this.form.get("rows") as FormArray;
  }

  onUtilitySelect(event: any, i: any) {
    this.rows.at(i).get("utilityId")?.setValue(event.value);
  }

  // Function to create a row with dropdown, textbox, and isSaved flag
  createRow(): FormGroup {
    return this.fb.group({
      utilityId: ["", Validators.required], // Dropdown field
      accountNumber: ["", Validators.required], // Textbox field
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

  editRow(index: number): void {
    for (let i = 0; i < this.utilities.length; i++) {
      if (this.utilities[i].id == this.rows.at(index).value.utilityId.id) {
        this.selectedUtility = this.utilities[i];
      }
    }
    this.rows.at(index).get("isSaved")?.setValue(false); // Mark the row as editable
  }

  // Function to delete a row
  deleteRow(index: number): void {
    this.propertyService.deleteAccountNumber(this.rows.at(index).value.id).subscribe((res: any) => {
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
    this.utilityService.getAllUtilities().subscribe(
      (response: any) => {
        this.utilities = response.utilityDao; // Assign response to dropdownOptions
      },
      (error) => {
        console.error("Error fetching dropdown options:", error);
      }
    );
  }

  // Function to save a row
  saveRow(index: number): void {
    let rowId: any = "";
    if (this.selectedUtility != null) {
      rowId = this.selectedUtility.id;
    }
    const rowData = this.rows.at(index).value; // Get data from the row
    let payload: any = {
      utilityId: rowData.utilityId.id,
      accountNumber: rowData.accountNumber,
      propertyId: this.config.data.id,
      utilityName: rowData.utilityId.utilityName,
    };
    if (this.hasPreviousData && rowData.id > 0) {
      payload["id"] = rowData.id;
    }
    if (payload.accountNumber == "" || payload.accountNumber == null || payload.accountNumber == undefined) {
      this.toastService.showError("Account Number is required", "Error");
      return;
    }
    if (payload.utilityId == "" || payload.utilityId == null || payload.utilityId == undefined) {
      this.toastService.showError("Utility is required", "Error");
      return;
    }
    this.accountNumberCounter++;
    this.propertyService.saveAccountNumber(payload).subscribe(
      (response: any) => {
        if (response.status.toLowerCase() == "success") {
          this.toastService.showSuccess(response.message, "Success");
          this.rows.at(index).get("isSaved")?.setValue(true); // Mark the row as saved
          this.selectedUtility = null;
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

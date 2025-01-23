import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TransactionsService } from "../../transactions.service";
import { AlertDialogService } from "../../../shared/services/alert-dialog.service";
import { AlertDetails } from "../../../shared/models/alert-details";
import { ToastService } from "../../../shared/services/toast.service";
import { fields } from "../../../shared/constants/fields";

@Component({
  selector: "app-dynamic-result-form",
  templateUrl: "./dynamic-result-form.component.html",
  styleUrl: "./dynamic-result-form.component.css",
})
export class DynamicResultFormComponent implements OnInit {
  @Input() transactionId: any = null;
  resultForm: FormGroup | any;
  fileName: string = "";
  templateName: string = "";
  utilityName: string = "";
  propertyName: string = "";
  propertyGroupName: string = "";
  originalValues: any = null;
  fields: any[] = [];
  originalUIFields: any[] = [];
  docVerified: boolean = false;
  templateId: any = "";
  isImportant: boolean = false;
  fieldsToAdd: any[] = [];
  selectedNewField: any[] = [];
  selectedFields: any[] = [];
  constructor(
    private transactionsService: TransactionsService,
    private router: Router,
    private alertDialogService: AlertDialogService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.resultForm = new FormGroup({});
    this.getDataByTransactionId();
  }
  allFieldSelections: any[] = [];
  onFieldSelect(event: any) {
    this.selectedFields = [];
    this.selectedNewField = [];
    setTimeout(() => {
      this.selectedNewField = JSON.parse(JSON.stringify(event.value));
      this.selectedFields = JSON.parse(JSON.stringify(event.value));
    }, 10);
  }

  addNewFields() {
    this.allFieldSelections.push(this.selectedNewField);
    for (let field of this.selectedFields) {
      this.resultForm.addControl(field.key, new FormControl("", [Validators.required]));
    }
    // Add new fields from selectedFields to fields
    this.selectedFields.forEach((item2) => {
      if (!this.fields.some((item1) => item1.control === item2.key)) {
        this.fields.push({
          control: item2.key,
          label: item2.value,
        });
      }
    });
    if (this.allFieldSelections.length > 1) {
      let field = this.allFieldSelections[0];
      this.allFieldSelections = [];
      // compare allFieldSelections[0] with selectedNewField and keep non matching fields in new variable
      for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < this.selectedNewField.length; j++) {
          if (field[i] != undefined) {
            if (field[i].key === this.selectedNewField[j].key) {
              field.splice(j, 1);
              j--;
            }
          }
        }
      }

      // remove all the selected fields from resultForm and this.fields
      for (let deleteField of field) {
        this.resultForm.removeControl(deleteField.key);
      }
      this.fields = this.fields.filter((item1: any) => !field.some((item2: any) => item2.key === item1.control));
    }
  }

  removeNewFields() {
    // remove all the selected fields from resultForm and this.fields
    for (let field of this.selectedFields) {
      this.resultForm.removeControl(field.key);
    }
    this.fields = this.fields.filter((item1: any) => !this.selectedFields.some((item2) => item2.key === item1.control));
    this.selectedFields = [];
    this.selectedNewField = [];
  }

  getUIFieldsByTemplateId(templateId: any) {
    this.transactionsService.getUIFieldsByTemplateId(templateId).subscribe((data: any) => {
      this.fields = JSON.parse(data.uiFieldsJosn);
      this.originalUIFields = JSON.parse(data.uiFieldsJosn);
      let allFields = fields;
      for (let field of this.fields) {
        allFields = allFields.filter((f) => f.key != field.control);
        this.resultForm.addControl(field.control, new FormControl("", [Validators.required]));
        if (this.docVerified) {
          this.resultForm.controls[field.control].disable();
        } else {
          this.resultForm.controls[field.control].enable();
        }
      }
      this.resultForm.patchValue(this.originalValues);
      this.resultForm.addControl("remark", new FormControl({ value: "", disabled: true }, [Validators.required]));
      this.resultForm.addControl("isImp", new FormControl(false));
      this.fieldsToAdd = allFields;
    });
  }

  convertDateStringsToDates(obj: any): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key.toLocaleLowerCase().includes("date") && obj[key]) {
          obj[key] = new Date(obj[key]);
        }
      }
    }
    return obj;
  }

  getDataByTransactionId() {
    this.transactionsService.getDataByTransactionId(this.transactionId).subscribe((data: any) => {
      if (data.status.toLowerCase() == "verified") {
        this.docVerified = true;
      } else {
        this.docVerified = false;
      }
      this.templateId = data.template_id;
      this.fileName = data.fileName;
      this.templateName = data.templateName;
      this.utilityName = data.utilityName;
      this.propertyName = data.propertyName;
      this.propertyGroupName = data.propertyGroupName;
      if (this.propertyName == "" || this.propertyName == null) {
        let alertDialogDetails: AlertDetails = {
          showWarningIcon: true,
          title: "Service Address Not Found",
          message: "Please add service address first.",
          showOkButton: true,
          okButtonLabel: "Back to Dashboard",
          routerLink: "/enhancor/transactions",
        };
        this.alertDialogService.openAlertDialog(alertDialogDetails);
      }

      // Convert date strings to Date objects
      const convertedData = this.convertDateStringsToDates(data);
      this.originalValues = convertedData;
      this.getUIFieldsByTemplateId(data.template_id);
    });
  }

  submitDisabled: boolean = false;
  submit() {
    let log = this.generateChangeSummary();

    // add TransactionId in form
    this.resultForm.value["id"] = this.transactionId;
    // add active flag as Y
    // add template_id
    this.resultForm.value["template_id"] = this.templateId;
    this.resultForm.value["activeFlag"] = "Y";
    this.resultForm.value["status"] = "verified";
    if (log.length > 22) {
      this.resultForm.value["auditLog"] = log;
    } else {
      this.resultForm.value["auditLog"] = "";
    }
    this.submitDisabled = true;
    this.transactionsService.verifyDoc(this.resultForm.value).subscribe(
      (data: any) => {
        if (data.status.toLowerCase() == "success") {
          this.toastService.showSuccess(data.message, "Success");
          setTimeout(() => {
            this.submitDisabled = false;
            this.router.navigate(["/enhancor/transactions"]);
          }, 3000);
        } else {
          this.submitDisabled = false;
          this.toastService.showError(data.message, "Error");
        }
      },
      () => {
        this.submitDisabled = false;
      }
    );
  }

  updateAccountNumber() {
    if (!this.resultForm.value.accountNumber) {
      this.toastService.showWarning("Please enter account number.", "Warning");
    } else {
      this.transactionsService
        .getPropertyByAccountNo(this.resultForm.value.accountNumber, this.templateId, this.transactionId)
        .subscribe((data: any) => {
          if (data.status == "uploaded" || data.status == "property_not_found") {
            this.templateName = data.templateName;
            this.utilityName = data.utilityName;
            this.propertyName = data.propertyName;
            this.propertyGroupName = data.propertyGroupName;
            if (this.propertyName == "" || this.propertyName == null) {
              let alertDialogDetails: AlertDetails = {
                showWarningIcon: true,
                title: "Service Address Not Found",
                message: "Please add service address first.",
                showOkButton: true,
                okButtonLabel: "Back to Dashboard",
                routerLink: "/enhancor/transactions",
              };
              this.alertDialogService.openAlertDialog(alertDialogDetails);
            } else {
              this.toastService.showSuccess("Service address details updated successfully.", "Success");
            }
          } else {
            let alertDialogDetails: AlertDetails = {
              showWarningIcon: true,
              title: "Service Address Not Found",
              message: data.message,
              showOkButton: true,
              okButtonLabel: "Ok",
            };
            this.alertDialogService.openAlertDialog(alertDialogDetails);
          }
        });
    }
  }

  onCheckBoxValueChange(event: any) {
    this.isImportant = event.checked;
    this.resultForm.patchValue({ isImp: this.isImportant });
    const remarkControl = this.resultForm.get("remark");
    if (this.isImportant) {
      remarkControl?.enable();
    } else {
      remarkControl?.disable();
    }
  }

  generateChangeSummary(): string {
    const changes: string[] = [];

    // Create a lookup object for faster key-to-value mapping
    const fieldLookup: { [key: string]: string } = this.originalUIFields.reduce(
      (acc, field) => ({ ...acc, [field.control]: field.label }),
      {}
    );

    // Create a lookup object for faster key-to-value mapping
    const newFieldLookup: { [key: string]: string } = this.fieldsToAdd.reduce(
      (acc, field) => ({ ...acc, [field.key]: field.value }),
      {}
    );

    const allKeys = new Set([...Object.keys(this.resultForm.value), ...Object.keys(this.originalValues)]);

    for (const key of allKeys) {
      const displayName = fieldLookup[key] || key; // Use field value or fallback to key

      if (key in this.resultForm.value && key in this.originalValues && fieldLookup[key]) {
        if (this.resultForm.value[key] !== this.originalValues[key]) {
          if (displayName != "isImp") {
            let originalValue = this.originalValues[key] || "empty";
            if (changes.length === 0) {
              changes.push(
                `User updated data for ${displayName}, where old value was ${originalValue} and new value is ${this.resultForm.value[key]}`
              );
            } else {
              changes.push(
                `and for ${displayName} where old value was ${originalValue} and new value is ${this.resultForm.value[key]}`
              );
            }
          }
        }
      } else if (key in this.originalValues && this.resultForm.value[key] && !fieldLookup[key]) {
        const newFieldDisplayName = newFieldLookup[key] || key; // Use field value or fallback to key
        changes.push(
          `Additionally, user added new field ${newFieldDisplayName} with value ${this.resultForm.value[key]}`
        );
      }
    }

    return changes.join(", ");
  }
}

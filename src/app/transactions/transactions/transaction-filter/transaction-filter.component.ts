import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-transaction-filter",
  templateUrl: "./transaction-filter.component.html",
  styleUrl: "./transaction-filter.component.css",
})
export class TransactionFilterComponent {
  filterForm: FormGroup | any;
  properties: any[] = [];
  batches: any[] = [];
  minDate: Date = new Date(2024, 0, 1);
  maxDate: Date = new Date();
  selectButtonOptions: any[] = [
    {
      label: "Processing Date",
      value: "processing",
    },
    {
      label: "Billing Date",
      value: "billing",
    },
  ];
  currentSelection: string = this.selectButtonOptions[0].value;
  constructor(
    public ref: DynamicDialogRef,
    private datePipe: DatePipe,
    private toastService: ToastService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    let year = this.config.data.year;
    let month = this.config.data.month;
    let startDate = new Date(year, month - 1, 1);
    let endDate = new Date(year, month, 0);
    this.minDate = startDate;
    this.maxDate = endDate;
    if (this.config.data.processingFromDate) {
      this.currentSelection = "processing";
      startDate = new Date(this.config.data.processingFromDate);
      endDate = new Date(this.config.data.processingToDate);
    } else if (this.config.data.billingFromDay) {
      this.currentSelection = "billing";
      startDate = new Date(this.config.data.billingFromDay);
      endDate = new Date(this.config.data.billingToDay);
    } else {
      let startDate = new Date(year, month - 1, 1);
      let endDate = new Date(year, month, 0);
    }
    this.filterForm = new FormGroup({
      fromDate: new FormControl(startDate),
      toDate: new FormControl(endDate),
    });
    if (this.config.data && this.config.data.fromDate && this.config.data.toDate) {
      this.filterForm.patchValue({
        fromDate: new Date(this.config.data.fromDate),
        toDate: new Date(this.config.data.toDate),
      });
    }
  }

  onSelectionChange(value: string) {
    this.currentSelection = value;
    let year = this.config.data.year;
    let month = this.config.data.month;
    let startDate = new Date(year, month - 1, 1);
    let endDate = new Date(year, month, 0);
    // set default fromDate and toDate

    this.filterForm.get("fromDate").setValue(startDate);
    this.filterForm.get("toDate").setValue(endDate);
  }

  applyFilter() {
    // add validation for from date and to date
    if (
      this.filterForm.value.fromDate &&
      this.filterForm.value.toDate &&
      this.filterForm.value.fromDate > this.filterForm.value.toDate
    ) {
      this.toastService.showWarning("From Date cannot be greater than To Date.", "Warning");
      return;
    } else if (this.filterForm.value.fromDate && !this.filterForm.value.toDate) {
      this.toastService.showWarning("Please select To Date.", "Warning");
      return;
    } else if (!this.filterForm.value.fromDate && this.filterForm.value.toDate) {
      this.toastService.showWarning("Please select From Date.", "Warning");
      return;
    } else if (!this.filterForm.value.fromDate && !this.filterForm.value.toDate) {
      this.toastService.showWarning("Please select From Date and To Date.", "Warning");
      return;
    } else {
      // format date to yyyy-MM-dd
      this.filterForm.value.fromDate = this.datePipe.transform(this.filterForm.value.fromDate, "yyyy-MM-dd");
      this.filterForm.value.toDate = this.datePipe.transform(this.filterForm.value.toDate, "yyyy-MM-dd");
      if (this.currentSelection == "processing") {
        this.ref.close({
          processingFromDate: this.filterForm.value.fromDate,
          processingToDate: this.filterForm.value.toDate,
        });
      } else {
        this.ref.close({
          billingFromDay: this.filterForm.value.fromDate,
          billingToDay: this.filterForm.value.toDate,
        });
      }
    }
  }

  close() {
    this.ref.close("");
  }
}

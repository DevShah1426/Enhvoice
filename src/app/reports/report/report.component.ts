import { Component, OnInit } from "@angular/core";
import { HeaderService } from "../../shared/services/header.service";
import { MenuItem } from "primeng/api";
import { saveAs } from "file-saver";
import { DatePipe } from "@angular/common";
import { TransactionsService } from "../../transactions/transactions.service";
import { FormControl, FormGroup } from "@angular/forms";
import { HttpParams } from "@angular/common/http";
import { ReportFilterComponent } from "../report-filter/report-filter.component";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ExportExcelService } from "../../shared/services/export-excel.service";
import { ToastService } from "../../shared/services/toast.service";
@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrl: "./report.component.css",
})
export class ReportComponent implements OnInit {
  filterForm: FormGroup | any;
  maxDate: Date = new Date();
  ref: DynamicDialogRef | any;
  showOnlyVerified: boolean = true;
  menuItems: MenuItem[] = [
    {
      label: "Excel",
      command: () => {
        this.downloadExcel();
      },
    },
    {
      label: "CSV",
      command: () => {
        this.downloadCsv();
      },
    },
    {
      label: "PowerBI",
      command: () => {
        this.downloadPowerBI();
      },
    },
  ];
  filterBody: any = "";
  currentDate = new Date();
  nextDate = new Date();

  constructor(
    private headerService: HeaderService,
    private datePipe: DatePipe,
    private transactionsService: TransactionsService,
    public dialogService: DialogService,
    private exportExcelService: ExportExcelService,
    private toastService: ToastService
  ) {
    headerService.updateHeader({
      title: "Reports",
      icon: "reports",
    });
  }
  allRecords: any[] = [];
  ngOnInit(): void {
    this.nextDate.setDate(this.currentDate.getDate() + 1);
    this.filterForm = new FormGroup({
      fromDate: new FormControl(new Date()),
      toDate: new FormControl(this.nextDate),
    });
    this.getAllUploadedFiles();
  }

  dataColumns = [
    { field: "propertyGroupName", header: "Property Name", width: "15%" },
    { field: "serviceBlockFullAddress", header: "Service Address Name", width: "15%" },
    { field: "accountNumber", header: "Account Number", width: "15%" },
    { field: "billingFromDate", header: "Billing From", width: "10%" },
    { field: "billingToDate", header: "Billing To", width: "10%" },
    { field: "rate", header: "Rate", width: "10%" },
    { field: "meterNumber", header: "Meter Number", width: "10%" },
    { field: "billAmount", header: "Bill Amount", width: "10%" },
    { field: "amountDue", header: "Amount Due", width: "10%" },
    { field: "utilityName", header: "Utility Name", width: "10%" },
  ];
  dataList: any = [];
  getDates() {
    if (this.filterForm.value.fromDate && this.filterForm.value.toDate) {
      if (this.filterForm.value.fromDate > this.filterForm.value.toDate) {
        this.toastService.showWarning("From Date cannot be greater than To Date", "Warning");
        return;
      } else {
        this.getAllUploadedFiles();
      }
    } else {
      this.toastService.showWarning("Please select From Date and To Date", "Warning");
    }
  }
  getAllUploadedFiles() {
    this.dataList = [];
    const fromDate: any = this.datePipe.transform(this.filterForm.get("fromDate").value, "yyyy-MM-dd");
    const toDate: any = this.datePipe.transform(this.filterForm.get("toDate").value, "yyyy-MM-dd");

    const params = new HttpParams().set("fromDate", fromDate).set("toDate", toDate);
    this.transactionsService.getReportDetails(params).subscribe((res: any) => {
      if (res.trnDocumentDao.length > 0) {
        for (let i = 0; i < res.trnDocumentDao.length; i++) {
          res.trnDocumentDao[i].billingFromDate = this.datePipe.transform(
            res.trnDocumentDao[i].billingFromDate,
            "MM-dd-yy"
          );
          res.trnDocumentDao[i].billingToDate = this.datePipe.transform(
            res.trnDocumentDao[i].billingToDate,
            "MM-dd-yy"
          );
          res.trnDocumentDao[i].billDate = this.datePipe.transform(res.trnDocumentDao[i].billDate, "MM-dd-yy");
        }
        this.dataList = res.trnDocumentDao;
        this.allRecords = res.trnDocumentDao;
        this.getVerifiedRecords(true);
      } else {
        this.dataList = [];
        this.toastService.showWarning("No data available for selected date range", "Warning");
      }
    });
  }

  downloadExcel() {
    this.exportExcelService.downloadExcel(this.dataList, this.dataColumns);
  }

  downloadPowerBI() {
    let dataColumns = [
      { field: "id", header: "Unique Id" },
      { field: "accountNumber", header: "Account Number" },
      { field: "propertyYardyId", header: "Community Code" },
      { field: "glCode", header: "GL Code" },
      { field: "propertyGroupName", header: "Property Name" },
      { field: "utilityName", header: "Utility Name" },
      { field: "providerName", header: "Provider" },
      { field: "serviceBlockFullAddress", header: "Service Address" },
      { field: "billingFromDate", header: "Service Start Date" },
      { field: "billingToDate", header: "Service End Date" },
      { field: "billDate", header: "Bill Date" },
      { field: "cost", header: "Cost" },
      { field: "usage", header: "Usage" },
      { field: "totalElectricitySupplyCharges", header: "Total Electricity Supply Charges" },
      { field: "totalElectricityDeliveryCharges", header: "Total Electricity Delivery Charges" },
      { field: "totalGasDeliveryCharges", header: "Total Gas Delivery Charges" },
      { field: "totalGasSupplyCharges", header: "Total Gas Supply Charges" },
      { field: "waterSupplyCharges", header: "Water Supply Charges" },
      { field: "sewerSupplyCharges", header: "Sewer Supply Charges" },
      { field: "meterNumber", header: "Meter#" },
      { field: "readType", header: "Read Type" },
      { field: "currentUsage", header: "Current Usage" },
      { field: "previouseUsage", header: "Previous Usage" },
      { field: "thermFactor", header: "Therm Factor" },
      { field: "multiplier", header: "Multiplier" },
      { field: "rate", header: "Rate" },
      { field: "usageTotal", header: "Total Usage" },
      { field: "previousBal", header: "Previous Balance" },
      { field: "paymentsAdjustments", header: "Payments/Adjustments" },
      { field: "balanceForword", header: "Balance Forward" },
      { field: "paymentAgreementInstallment", header: "Payment Agreement Installment" },
      { field: "adjustments", header: "Adjustments" },
      { field: "amountDue", header: "Total Amount Due" },
      { field: "dueDate", header: "Due Date" },

      { field: "meterNumber1", header: "Meter Number 1" },
      { field: "currentRead1", header: "Current Read 1" },
      { field: "readType1", header: "Read Type 1" },
      { field: "previousRead1", header: "Previous Read 1" },
      { field: "totalUsage1", header: "Total Usage 1" },

      { field: "meterNumber2", header: "Meter Number 2" },
      { field: "currentRead2", header: "Current Read 2" },
      { field: "readType2", header: "Read Type 2" },
      { field: "previousRead2", header: "Previous Read 2" },
      { field: "totalUsage2", header: "Total Usage 2" },

      { field: "meterNumber3", header: "Meter Number 3" },
      { field: "currentRead3", header: "Current Read 3" },
      { field: "readType3", header: "Read Type 3" },
      { field: "previousRead3", header: "Previous Read 3" },
      { field: "totalUsage3", header: "Total Usage 3" },

      { field: "meterNumber4", header: "Meter Number 4" },
      { field: "currentRead4", header: "Current Read 4" },
      { field: "readType4", header: "Read Type 4" },
      { field: "previousRead4", header: "Previous Read 4" },
      { field: "totalUsage4", header: "Total Usage 4" },

      { field: "meterNumber5", header: "Meter Number 5" },
      { field: "currentRead5", header: "Current Read 5" },
      { field: "readType5", header: "Read Type 5" },
      { field: "previousRead5", header: "Previous Read 5" },
      { field: "totalUsage5", header: "Total Usage 5" },

      { field: "meterNumber6", header: "Meter Number 6" },
      { field: "currentRead6", header: "Current Read 6" },
      { field: "readType6", header: "Read Type 6" },
      { field: "previousRead6", header: "Previous Read 6" },
      { field: "totalUsage6", header: "Total Usage 6" },

      { field: "meterNumber7", header: "Meter Number 7" },
      { field: "currentRead7", header: "Current Read 7" },
      { field: "readType7", header: "Read Type 7" },
      { field: "previousRead7", header: "Previous Read 7" },
      { field: "totalUsage7", header: "Total Usage 7" },

      { field: "meterNumber8", header: "Meter Number 8" },
      { field: "currentRead8", header: "Current Read 8" },
      { field: "readType8", header: "Read Type 8" },
      { field: "previousRead8", header: "Previous Read 8" },
      { field: "totalUsage8", header: "Total Usage 8" },

      { field: "meterNumber9", header: "Meter Number 9" },
      { field: "currentRead9", header: "Current Read 9" },
      { field: "readType9", header: "Read Type 9" },
      { field: "previousRead9", header: "Previous Read 9" },
      { field: "totalUsage9", header: "Total Usage 9" },

      { field: "meterNumber10", header: "Meter Number 10" },
      { field: "currentRead10", header: "Current Read 10" },
      { field: "readType10", header: "Read Type 10" },
      { field: "previousRead10", header: "Previous Read 10" },
      { field: "totalUsage10", header: "Total Usage 10" },

      { field: "duplicateFlag", header: "Duplicate" },
    ];
    this.exportExcelService.downloadExcel(this.dataList, dataColumns);
  }

  downloadCsv() {
    let csvData = this.convertToCSV(
      this.dataList,
      this.dataColumns.map((c) => c.field),
      this.dataColumns.map((c) => c.header)
    );
    let blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "report_" + this.datePipe.transform(new Date(), "yyyy_MM_dd_hh_mm_ss") + ".csv");
  }

  private convertToCSV(objArray: any[], fields: string[], headers: string[]): string {
    const csvHeaders = headers.join(",");
    const csvRows = objArray.map((row) => {
      return fields
        .map((field) => {
          let value = row[field];
          if (typeof value === "string") {
            value = value.replace(/"/g, '""'); // Escape double quotes
          }
          return `"${value}"`;
        })
        .join(",");
    });
    return [csvHeaders, ...csvRows].join("\n");
  }

  getVerifiedRecords(event: any) {
    let records: any = this.allRecords;
    this.dataList = [];
    if (event == true) {
      for (let i = 0; i < records.length; i++) {
        if (records[i]["status"].toLowerCase() == "verified") {
          this.dataList.push(records[i]);
        }
      }
    } else {
      for (let i = 0; i < records.length; i++) {
        this.dataList.push(records[i]);
      }
    }
  }

  openFilter() {
    this.ref = this.dialogService.open(ReportFilterComponent, {
      height: "auto",
      width: "60%",
      closable: true,
      showHeader: false,
      position: "center",
      data: this.filterBody,
    });
    this.ref.onClose.subscribe((result: any) => {
      if (result) {
        this.filterBody = result;
        this.applyFilter();
      }
    });
  }

  applyFilter() {
    this.dataList = [];
    this.transactionsService.filterReport(this.filterBody).subscribe((res: any) => {
      if (res.propertyDao.length > 0) {
        this.dataList = res.propertyDao;
        this.allRecords = res.propertyDao;
      } else {
        this.dataList = [];
        this.toastService.showWarning("No data available for selected filter", "Warning");
      }
    });
  }
}

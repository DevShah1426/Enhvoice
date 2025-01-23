import { Component, OnDestroy, OnInit } from "@angular/core";
import { HeaderService } from "../../shared/services/header.service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { AddEditPropertyComponent } from "./add-edit-property/add-edit-property.component";
import { PropertyService } from "./property.service";
import { ToastService } from "../../shared/services/toast.service";
import { AlertDetails } from "../../shared/models/alert-details";
import { AlertDialogService } from "../../shared/services/alert-dialog.service";
import { Subscription } from "rxjs";
import { AddEditAccountNumbersComponent } from "./add-edit-account-numbers/add-edit-account-numbers.component";
import { PermissionService } from "../../shared/services/permission.service";

@Component({
  selector: "app-property",
  templateUrl: "./property.component.html",
  styleUrl: "./property.component.css",
})
export class PropertyComponent implements OnDestroy, OnInit {
  ref: DynamicDialogRef | any;
  resultSubscription: Subscription | any;
  allRecords: any[] = [];
  searchText: string = "";
  actionPermissions: { [key: string]: boolean } = {};

  constructor(
    private headerService: HeaderService,
    public dialogService: DialogService,
    private propertyService: PropertyService,
    private toastService: ToastService,
    private alertDialogService: AlertDialogService,
    private permissionService: PermissionService
  ) {
    this.getAllProperties();
    headerService.updateHeader({
      title: "Service Address",
      icon: "property",
    });
  }

  dataColumns = [
    { field: "pgName", header: "Property Name", width: "30%" },
    { field: "serviceBlockFullAddress", header: "Service Address", width: "30%" },
    { field: "noOfAccounts", header: "Number of Accounts", width: "30%" },
  ];
  dataList: any[] = [];

  ngOnInit(): void {
    this.actionPermissions = {
      accountNumber: this.permissionService.hasPermission("addProperty"),
      edit: this.permissionService.hasPermission("addProperty"),
      delete: this.permissionService.hasPermission("addProperty"),
    };
  }

  ngOnDestroy(): void {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  getAllProperties() {
    this.dataList = [];
    this.allRecords = [];
    this.propertyService.getAllNotArchivedProperty().subscribe((res: any) => {
      this.dataList = res;
      this.allRecords = res;
      if (this.searchText) {
        this.onSearchTextChange(this.searchText);
      }
    });
  }

  onRecordSelected(records: any[]) {}

  addEditRecord(data: any = "") {
    this.ref = this.dialogService.open(AddEditPropertyComponent, {
      height: "auto",
      width: "60%",
      closable: false,
      showHeader: false,
      position: "center",
      data: data,
    });
    this.ref.onClose.subscribe((result: any) => {
      if (result != "") {
        if (result.status.toLowerCase() == "success") {
          this.toastService.showSuccess(result.message, "Success");
          this.getAllProperties();
        } else {
          this.toastService.showError(result.message, "Error");
        }
      }
    });
  }

  onActionClick(event: any) {
    if (event.action == "edit") {
      this.addEditRecord(event.record);
    } else if (event.action == "accountNumber") {
      this.addEditAccountNumber(event.record);
    } else {
      this.deleteRecord(event.record);
    }
  }

  addEditAccountNumber(record: any) {
    this.ref = this.dialogService.open(AddEditAccountNumbersComponent, {
      height: "auto",
      width: "60%",
      closable: false,
      showHeader: false,
      position: "center",
      data: record,
    });
    this.ref.onClose.subscribe((result: any) => {
      if (result != "") {
        if (typeof result == "object" && result.status.toLowerCase() == "success") {
          this.toastService.showSuccess(result.message, "Success");
          this.getAllProperties();
        } else if (result > 0) {
          this.getAllProperties();
        } else {
          this.toastService.showError(result.message, "Error");
        }
      }
    });
  }

  deleteRecord(event: any) {
    let alertDialogDetails: AlertDetails = {
      showWarningIcon: true,
      title: "Delete Record?",
      message: "Are you sure you want to delete service address " + event.serviceBlockFullAddress + "?",
      showOkButton: true,
      okButtonLabel: "Delete",
    };
    this.alertDialogService.openAlertDialog(alertDialogDetails);
    // Unsubscribe from any previous subscription
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
    this.resultSubscription = this.alertDialogService.result$.subscribe((result: any) => {
      if (result) {
        this.propertyService.deleteProperty({ id: event.id }).subscribe((res: any) => {
          if (res.status.toLowerCase() == "success") {
            this.toastService.showSuccess(res.message, "Success");
            this.getAllProperties();
          } else {
            this.toastService.showError(res.message, "Error");
          }
        });
      }
    });
  }

  onSearchTextChange(searchText: string) {
    this.dataList = [];
    setTimeout(() => {
      this.searchText = searchText;
      // iterate over all records and filter out based on search text on serviceBlockAddress and pgName
      if (searchText) {
        this.dataList = this.allRecords.filter((record: any) => {
          return (
            (record.serviceBlockFullAddress &&
              record.serviceBlockFullAddress.toLowerCase().includes(searchText.toLowerCase())) ||
            (record.pgName && record.pgName.toLowerCase().includes(searchText.toLowerCase()))
          );
        });
      } else {
        this.dataList = this.allRecords;
      }
    }, 10);
  }
}

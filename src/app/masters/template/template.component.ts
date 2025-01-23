import { Component, OnDestroy, OnInit } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subscription } from "rxjs";
import { HeaderService } from "../../shared/services/header.service";
import { ToastService } from "../../shared/services/toast.service";
import { AlertDialogService } from "../../shared/services/alert-dialog.service";
import { PermissionService } from "../../shared/services/permission.service";
import { AddEditTemplateComponent } from "./add-edit-template/add-edit-template.component";
import { AlertDetails } from "../../shared/models/alert-details";
import { TemplateService } from "./template.service";
import { TransactionsService } from "../../transactions/transactions.service";

@Component({
  selector: "app-template",
  templateUrl: "./template.component.html",
  styleUrl: "./template.component.css",
})
export class TemplateComponent implements OnDestroy, OnInit {
  ref: DynamicDialogRef | any;
  resultSubscription: Subscription | any;
  allRecords: any[] = [];
  searchText: string = "";
  actionPermissions: { [key: string]: boolean } = {};

  constructor(
    private headerService: HeaderService,
    public dialogService: DialogService,
    private templateService: TemplateService,
    private toastService: ToastService,
    private alertDialogService: AlertDialogService,
    private permissionService: PermissionService,
    private transactionsService: TransactionsService
  ) {
    this.getAll();
    headerService.updateHeader({
      title: "Template",
      icon: "property",
    });
  }

  dataColumns = [
    { field: "octType", header: "Template Name", width: "50%" },
    { field: "propertyCount", header: "Total Associated Properties", width: "50%" },
  ];
  dataList: any[] = [];

  ngOnInit(): void {
    this.actionPermissions = {
      propertyAssociation: this.permissionService.hasPermission("addAssociation"),
      delete: this.permissionService.hasPermission("addAssociation"),
    };
  }

  ngOnDestroy(): void {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  getAll() {
    this.dataList = [];
    this.allRecords = [];
    this.transactionsService.getAllTemplatesV1().subscribe((res: any) => {
      this.dataList = res.ocrTemplateDao;
      this.allRecords = res.ocrTemplateDao;
      if (this.searchText) {
        this.onSearchTextChange(this.searchText);
      }
    });
  }

  onRecordSelected(records: any[]) {}

  onActionClick(event: any) {
    if (event.action == "propertyAssociation") {
      this.addEditAccountNumber(event.record);
    } else {
      this.deleteRecord(event.record);
    }
  }

  addEditAccountNumber(record: any) {
    this.ref = this.dialogService.open(AddEditTemplateComponent, {
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
          this.getAll();
        } else if (result > 0) {
          this.getAll();
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
      message: "Are you sure you want to delete template " + event.octType + " along with its associated properties?",
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
        this.templateService.deleteTemplate({ templateId: event.id }).subscribe((res: any) => {
          if (res.status.toLowerCase() == "success") {
            this.toastService.showSuccess(res.message, "Success");
            this.getAll();
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
          return record.octType.toLowerCase().includes(searchText.toLowerCase());
        });
      } else {
        this.dataList = this.allRecords;
      }
    }, 10);
  }
}

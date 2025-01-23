import { Component, OnDestroy } from "@angular/core";
import { AddEditProviderComponent } from "./add-edit-provider/add-edit-provider.component";
import { HeaderService } from "../../shared/services/header.service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ProviderService } from "./provider.service";
import { ToastService } from "../../shared/services/toast.service";
import { AlertDetails } from "../../shared/models/alert-details";
import { AlertDialogService } from "../../shared/services/alert-dialog.service";
import { Subscription } from "rxjs";
import { PermissionService } from "../../shared/services/permission.service";

@Component({
  selector: "app-provider",
  templateUrl: "./provider.component.html",
  styleUrl: "./provider.component.css",
})
export class ProviderComponent implements OnDestroy {
  ref: DynamicDialogRef | any;
  resultSubscription: Subscription | any;
  searchText: string = "";
  constructor(
    private headerService: HeaderService,
    public dialogService: DialogService,
    private providerService: ProviderService,
    private toastService: ToastService,
    private alertDialogService: AlertDialogService,
    private permissionService: PermissionService
  ) {
    this.getAllUtilities();
    headerService.updateHeader({
      title: "Providers",
      icon: "users",
    });
  }

  dataColumns = [
    { field: "providerName", header: "Vendor Name", width: "50%" },
    { field: "code", header: "Vendor Code", width: "50%" },
  ];
  dataList: any[] = [];
  allRecords: any[] = [];
  actionPermissions: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.actionPermissions = {
      edit: this.permissionService.hasPermission("addProvider"),
      delete: this.permissionService.hasPermission("addProvider"),
    };
  }

  ngOnDestroy(): void {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  getAllUtilities() {
    this.dataList = [];
    this.allRecords = [];
    this.providerService.getAllProviders().subscribe((res: any) => {
      this.dataList = res.providerDao;
      this.allRecords = res.providerDao;
      if (this.searchText) {
        this.onSearchTextChange(this.searchText);
      }
    });
  }

  addEditRecord(data: any = "") {
    this.ref = this.dialogService.open(AddEditProviderComponent, {
      height: "auto",
      width: "50%",
      closable: false,
      showHeader: false,
      position: "center",
      data: data,
    });
    this.ref.onClose.subscribe((result: any) => {
      if (result != "") {
        if (result.status.toLowerCase() == "success") {
          this.toastService.showSuccess(result.message, "Success");
          this.getAllUtilities();
        } else {
          this.toastService.showError(result.message, "Error");
        }
      }
    });
  }

  onActionClick(event: any) {
    if (event.action == "edit") {
      this.addEditRecord(event.record);
    } else {
      this.deleteRecord(event.record);
    }
  }

  deleteRecord(event: any) {
    let alertDialogDetails: AlertDetails = {
      showWarningIcon: true,
      title: "Delete Record?",
      message: "Are you sure you want to delete vendor " + event.providerName + "?",
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
        this.providerService.deleteProvider({ id: event.id }).subscribe((res: any) => {
          if (res.status.toLowerCase() == "success") {
            this.toastService.showSuccess(res.message, "Success");
            this.getAllUtilities();
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
            record.providerName.toLowerCase().includes(searchText.toLowerCase()) ||
            record.code.toLowerCase().includes(searchText.toLowerCase())
          );
        });
      } else {
        this.dataList = this.allRecords;
      }
    }, 10);
  }
}

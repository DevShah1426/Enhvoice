import { Component, OnDestroy } from "@angular/core";
import { AddEditUtilityComponent } from "./add-edit-utility/add-edit-utility.component";
import { HeaderService } from "../../shared/services/header.service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToastService } from "../../shared/services/toast.service";
import { UtilityService } from "./utility.service";
import { Subscription } from "rxjs";
import { AlertDialogService } from "../../shared/services/alert-dialog.service";
import { PermissionService } from "../../shared/services/permission.service";

@Component({
  selector: "app-utility",
  templateUrl: "./utility.component.html",
  styleUrl: "./utility.component.css",
})
export class UtilityComponent implements OnDestroy {
  ref: DynamicDialogRef | any;
  resultSubscription: Subscription | any;
  searchText: string = "";

  constructor(
    private headerService: HeaderService,
    public dialogService: DialogService,
    private utilityService: UtilityService,
    private toastService: ToastService,
    private alertDialogService: AlertDialogService,
    private permissionService: PermissionService
  ) {
    this.getAllUtilities();
    headerService.updateHeader({
      title: "Utilities",
      icon: "users",
    });
  }

  dataColumns = [
    { field: "utilityName", header: "Name", width: "50%" },
    { field: "glCode", header: "GL Code", width: "50%" },
  ];
  dataList: any[] = [];
  allRecords: any[] = [];
  actionPermissions: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.actionPermissions = {
      edit: this.permissionService.hasPermission("addUtilities"),
      delete: this.permissionService.hasPermission("addUtilities"),
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
    this.utilityService.getAllUtilities().subscribe((res: any) => {
      this.dataList = res.utilityDao;
      this.allRecords = res.utilityDao;
      if (this.searchText) {
        this.onSearchTextChange(this.searchText);
      }
    });
  }

  addEditRecord(data: any = "") {
    this.ref = this.dialogService.open(AddEditUtilityComponent, {
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
    let alertDialogDetails: any = {
      showWarningIcon: true,
      title: "Delete Record?",
      message: "Are you sure you want to delete utility " + event.utilityName + "?",
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
        this.utilityService.deleteUtility({ id: event.id }).subscribe((res: any) => {
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
            record.utilityName.toLowerCase().includes(searchText.toLowerCase()) ||
            (record.glCode && record.glCode.toLowerCase().includes(searchText.toLowerCase()))
          );
        });
      } else {
        this.dataList = this.allRecords;
      }
    }, 10);
  }
}

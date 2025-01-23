import { Component, OnDestroy } from "@angular/core";
import { AddEditUsersComponent } from "./add-edit-users/add-edit-users.component";
import { HeaderService } from "../../shared/services/header.service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { UsersService } from "./users.service";
import { ToastService } from "../../shared/services/toast.service";
import { AlertDetails } from "../../shared/models/alert-details";
import { Subscription } from "rxjs";
import { AlertDialogService } from "../../shared/services/alert-dialog.service";
import { ResetPasswordComponent } from "../../shared/components/reset-password/reset-password.component";
import { PermissionService } from "../../shared/services/permission.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.css",
})
export class UsersComponent implements OnDestroy {
  ref: DynamicDialogRef | any;
  resultSubscription: Subscription | any;
  constructor(
    private headerService: HeaderService,
    public dialogService: DialogService,
    private usersService: UsersService,
    private toastService: ToastService,
    private alertDialogService: AlertDialogService,
    private permissionService: PermissionService
  ) {
    this.getAllUsers();
    headerService.updateHeader({
      title: "User Control",
      icon: "users",
    });
  }

  dataColumns = [
    { field: "empCode", header: "Employee Code", width: "20%" },
    { field: "ugpName", header: "User Group", width: "20%" },
    { field: "fullName", header: "Name", width: "20%" },
    { field: "email", header: "Email", width: "20%" },
    { field: "phone", header: "Phone No", width: "20%" },
  ];
  dataList: any[] = [];
  allRecords: any[] = [];
  actionPermissions: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.actionPermissions = {
      resetPassword: this.permissionService.hasPermission("addUsers"),
      edit: this.permissionService.hasPermission("addUsers"),
      delete: this.permissionService.hasPermission("addUsers"),
    };
  }

  ngOnDestroy(): void {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  getAllUsers() {
    this.dataList = [];
    this.allRecords = [];
    this.usersService.getAllUsers().subscribe((res: any) => {
      for (let i = 0; i < res.userDao.length; i++) {
        res.userDao[i].fullName = res.userDao[i].firstName + " " + res.userDao[i].lastName;
      }
      this.dataList = res.userDao;
      this.allRecords = res.userDao;
    });
  }

  addEditRecord(data: any = "") {
    this.ref = this.dialogService.open(AddEditUsersComponent, {
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
          this.getAllUsers();
        } else {
          this.toastService.showError(result.message, "Error");
        }
      }
    });
  }

  onActionClick(event: any) {
    if (event.action == "edit") {
      this.addEditRecord(event.record);
    } else if (event.action == "resetPassword") {
      this.resetPassword(event.record);
    } else {
      this.deleteRecord(event.record);
    }
  }

  resetPassword(data: any) {
    this.ref = this.dialogService.open(ResetPasswordComponent, {
      height: "auto",
      width: "25%",
      closable: false,
      showHeader: false,
      position: "center",
      data: data,
    });
    this.ref.onClose.subscribe((result: any) => {
      if (result != "") {
        if (result.status.toLowerCase() == "success") {
          this.toastService.showSuccess(result.message, "Success");
          this.getAllUsers();
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
      message: "Are you sure you want to delete user " + event.fullName + "?",
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
        this.usersService.deleteUser({ id: event.id }).subscribe((res: any) => {
          if (res.status.toLowerCase() == "success") {
            this.toastService.showSuccess(res.message, "Success");
            this.getAllUsers();
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
      // iterate over all records and filter out based on search text on serviceBlockAddress and pgName
      if (searchText) {
        this.dataList = this.allRecords.filter((record: any) => {
          return (
            record.empCode.toLowerCase().includes(searchText.toLowerCase()) ||
            record.ugpName.toLowerCase().includes(searchText.toLowerCase()) ||
            record.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
            record.email.toLowerCase().includes(searchText.toLowerCase()) ||
            record.phone.toLowerCase().includes(searchText.toLowerCase())
          );
        });
      } else {
        this.dataList = this.allRecords;
      }
    }, 10);
  }
}

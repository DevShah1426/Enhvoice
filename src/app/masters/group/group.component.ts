import { Component, OnDestroy, OnInit } from "@angular/core";
import { AddEditGroupComponent } from "./add-edit-group/add-edit-group.component";
import { HeaderService } from "../../shared/services/header.service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { GroupService } from "./group.service";
import { AlertDetails } from "../../shared/models/alert-details";
import { AlertDialogService } from "../../shared/services/alert-dialog.service";
import { Subscription } from "rxjs";
import { ToastService } from "../../shared/services/toast.service";
import { PermissionService } from "../../shared/services/permission.service";
import { ExportExcelService } from "../../shared/services/export-excel.service";

@Component({
  selector: "app-group",
  templateUrl: "./group.component.html",
  styleUrl: "./group.component.css",
})
export class GroupComponent implements OnDestroy, OnInit {
  ref: DynamicDialogRef | any;
  resultSubscription: Subscription | any;
  actionItems: any[] = [{ action: "archived", icon: "unarchive" }];
  selectButtonOptions = [
    {
      label: "Active",
      value: "non-archived",
    },
    {
      label: "Archived",
      value: "archived",
    },
  ];
  activeSelection: string = this.selectButtonOptions[0].value;
  searchTextVisible: boolean = true;
  searchText: string = "";

  constructor(
    private headerService: HeaderService,
    public dialogService: DialogService,
    private groupService: GroupService,
    private alertDialogService: AlertDialogService,
    private toastService: ToastService,
    private permissionService: PermissionService,
    private exportExcelService: ExportExcelService
  ) {
    this.getAllNotArchivedPropertyGroups();
    headerService.updateHeader({
      title: "Property",
      icon: "user-groups",
    });
  }
  ngOnInit(): void {
    this.actionPermissions = {
      "non-archived": this.permissionService.hasPermission("archiveUnarchiveProperty"),
      archived: this.permissionService.hasPermission("archiveUnarchiveProperty"),
      edit: this.permissionService.hasPermission("addPropertyGroup"),
    };
  }
  ngOnDestroy(): void {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  dataColumns = [
    { field: "propertyGroupName", header: "Property Name", width: "30%" },
    { field: "propertyYardyId", header: "Yardi/RealPage ID", width: "20%" },
    { field: "state", header: "State", width: "25%" },
    { field: "city", header: "City", width: "25%" },
  ];
  excelDataColumns = [
    { field: "id", header: "Property ID", width: "30%" },
    { field: "country", header: "Country", width: "30%" },
    { field: "propertyGroupName", header: "Property Name", width: "30%" },
    { field: "propertyYardyId", header: "Yardi/RealPage ID", width: "20%" },
    { field: "state", header: "State", width: "25%" },
    { field: "city", header: "City", width: "25%" },
  ];
  dataList: any[] = [];
  allRecords: any[] = [];
  actionPermissions: { [key: string]: boolean } = {};
  getAllNotArchivedPropertyGroups() {
    this.dataList = [];
    this.allRecords = [];
    this.groupService.getAllNotArchivedGroups().subscribe((res: any) => {
      this.searchTextVisible = true;
      this.dataList = res;
      this.allRecords = res;
      this.actionItems = [
        { action: "archived", icon: "unarchive" },
        { action: "edit", icon: "edit" },
      ];
      if (this.searchText) {
        this.onSearchTextChange(this.searchText);
      }
    });
  }

  getAllArchivedPropertyGroups() {
    this.dataList = [];
    this.allRecords = [];
    this.groupService.getAllArchivedGroups().subscribe((res: any) => {
      this.searchTextVisible = true;
      this.allRecords = res;
      this.dataList = res;
      this.actionItems = [{ action: "non-archived", icon: "archive" }];
      if (this.searchText) {
        this.onSearchTextChange(this.searchText);
      }
    });
  }

  onRecordSelected(records: any[]) {}

  addEditRecord(data: any = "") {
    this.ref = this.dialogService.open(AddEditGroupComponent, {
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
          this.getAllNotArchivedPropertyGroups();
        } else {
          this.toastService.showError(result.message, "Error");
        }
      }
    });
  }

  onActionClick(event: any) {
    if (event.action == "edit") {
      this.addEditRecord(event.record);
    } else if (event.action == "delete") {
      this.deleteRecord(event);
    } else {
      let alertDialogDetails: AlertDetails = {
        showWarningIcon: true,
        title: event.action == "archived" ? "Archive Record?" : "Activate Record?",
        message:
          "Are you sure you want to " +
          (event.action == "archived" ? "archive " : "activate ") +
          event.record.propertyGroupName +
          "?",
        showOkButton: true,
        okButtonLabel: event.action == "archived" ? "Archive " : "Activate ",
      };
      this.alertDialogService.openAlertDialog(alertDialogDetails);
      // Unsubscribe from any previous subscription
      if (this.resultSubscription) {
        this.resultSubscription.unsubscribe();
      }
      this.resultSubscription = this.alertDialogService.result$.subscribe((result: any) => {
        if (result) {
          this.archiveRecord(event);
        }
      });
    }
  }

  archiveRecord(event: any) {
    let body = {
      id: event.record.id,
      archiveYn: event.action == "archived" ? "Y" : "N",
    };
    this.groupService.archiveGroup(body).subscribe((res: any) => {
      if (res.status.toLowerCase() == "success") {
        let propertyGroupName = event.record.propertyGroupName;
        let action = event.action == "archived" ? "archived" : "un-archived";
        this.toastService.showSuccess(propertyGroupName + " has been " + action + " successfully.", "Success");
        if (event.action == "archived") this.getAllNotArchivedPropertyGroups();
        else this.getAllArchivedPropertyGroups();
      } else {
      }
    });
  }

  onSelectionChange(event: any) {
    this.searchText = "";
    this.searchTextVisible = false;
    if (event == "non-archived") {
      this.getAllNotArchivedPropertyGroups();
    } else if (event == "archived") {
      this.getAllArchivedPropertyGroups();
    }
  }

  deleteRecord(event: any) {
    let alertDialogDetails: AlertDetails = {
      showWarningIcon: true,
      title: "Delete Record?",
      message: "Are you sure you want to delete property " + event.record.propertyGroupName + "?",
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
        this.groupService.deleteGroup({ id: event.record.id }).subscribe((res: any) => {
          if (res.status.toLowerCase() == "success") {
            this.toastService.showSuccess(res.message, "Success");
            this.getAllNotArchivedPropertyGroups();
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
            (record.propertyGroupName && record.propertyGroupName.toLowerCase().includes(searchText.toLowerCase())) ||
            (record.state && record.state.toLowerCase().includes(searchText.toLowerCase())) ||
            (record.city && record.city.toLowerCase().includes(searchText.toLowerCase())) ||
            (record.propertyYardyId && record.propertyYardyId.toLowerCase().includes(searchText.toLowerCase()))
          );
        });
      } else {
        this.dataList = this.allRecords;
      }
    }, 10);
  }

  downloadExcel() {
    this.exportExcelService.downloadExcel(this.dataList, this.excelDataColumns, "property");
  }
}

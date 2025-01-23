import { Component, OnInit } from "@angular/core";
import { HeaderService } from "../../shared/services/header.service";
import { AuditLogsService } from "../audit-logs.service";
import { DatePipe } from "@angular/common";
import { ComingSoonComponent } from "../../shared/components/coming-soon/coming-soon.component";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { UsersService } from "../../masters/users/users.service";
import { GroupService } from "../../masters/group/group.service";
import { FormControl, FormGroup } from "@angular/forms";
import { ToastService } from "../../shared/services/toast.service";

@Component({
  selector: "app-audit-logs",
  templateUrl: "./audit-logs.component.html",
  styleUrl: "./audit-logs.component.css",
})
export class AuditLogsComponent implements OnInit {
  ref: DynamicDialogRef | any;
  users: any[] = [];
  properties: any[] = [];
  filterForm: FormGroup | any;
  maxDate: Date = new Date();
  constructor(
    private headerService: HeaderService,
    private auditLogsService: AuditLogsService,
    private datePipe: DatePipe,
    public dialogService: DialogService,
    private usersService: UsersService,
    private groupService: GroupService,
    private toastService: ToastService
  ) {
    headerService.updateHeader({
      title: "Audit Management",
      icon: "auditlogs",
    });
    this.getAllAuditLogs();
    this.getAllUsers();
    // this.getAllProperties();
  }
  ngOnInit(): void {
    this.filterForm = new FormGroup({
      userId: new FormControl(""),
      fromDate: new FormControl(),
      toDate: new FormControl(),
    });
  }

  dataColumns = [
    { field: "userFullName", header: "User", width: "20%" },
    { field: "action", header: "User Action", width: "30%" },
    { field: "auditTimestamp", header: "Date & Time", width: "25%" },
    { field: "ipAddress", header: "IP Address", width: "25%" },
  ];
  dataList = [];
  selectedUser: any = null;

  getAllUsers() {
    this.usersService.getAllUsers().subscribe((res: any) => {
      for (let i = 0; i < res.userDao.length; i++) {
        res.userDao[i].fullName = res.userDao[i].firstName + " " + res.userDao[i].lastName;
      }
      this.users = res.userDao;
    });
  }

  onUserSelect(event: any) {
    this.selectedUser = event;
    this.filterForm.get("userId").setValue(event.id);
  }

  getAllProperties() {
    this.groupService.getAllGroups().subscribe((res: any) => {
      this.properties = res.propertyGroupDao;
    });
  }

  getAllAuditLogs() {
    this.dataList = [];
    this.auditLogsService.getAllAuditLogs().subscribe((res: any) => {
      for (let i = 0; i < res.auditLogDao.length; i++) {
        res.auditLogDao[i].auditTimestamp = this.datePipe.transform(
          res.auditLogDao[i].auditTimestamp,
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      this.dataList = res.auditLogDao;
    });
  }

  onSearch() {
    this.dataList = [];
    // format date to yyyy-MM-dd
    if (this.filterForm.value.fromDate && this.filterForm.value.toDate) {
      this.filterForm.value.fromDate = this.datePipe.transform(this.filterForm.value.fromDate, "yyyy-MM-dd HH:mm");
      this.filterForm.value.toDate = this.datePipe.transform(this.filterForm.value.toDate, "yyyy-MM-dd HH:mm");
    } else {
      // remove the date if both date is not selected
      delete this.filterForm.value.fromDate;
      delete this.filterForm.value.toDate;
    }
    this.auditLogsService
      .filterAuditLogs(this.filterForm.value.userId, this.filterForm.value.fromDate, this.filterForm.value.toDate)
      .subscribe((res: any) => {
        if (res.auditLogDao.length == 0) {
          this.dataList = [];
          this.toastService.showWarning("No data available for selected filter", "Warning");
          return;
        }
        for (let i = 0; i < res.auditLogDao.length; i++) {
          res.auditLogDao[i].auditTimestamp = this.datePipe.transform(
            res.auditLogDao[i].auditTimestamp,
            "yyyy-MM-dd hh:mm:ss"
          );
        }
        this.dataList = res.auditLogDao;
      });
  }

  onActionClick(event: any) {
    this.ref = this.dialogService.open(ComingSoonComponent, {
      height: "auto",
      width: "60%",
      closable: true,
      showHeader: true,
      position: "center",
    });
    this.ref.onClose.subscribe((result: any) => {});
  }

  resetFilter() {
    this.selectedUser = null;
    this.filterForm.get("userId").setValue("");
    this.filterForm.get("fromDate").setValue(null);
    this.filterForm.get("toDate").setValue(null);
    this.onSearch();
  }
}

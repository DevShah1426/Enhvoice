import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TransactionsService } from "../../transactions/transactions.service";
import { PropertyService } from "../../masters/property/property.service";
import { DatePipe } from "@angular/common";
import { ToastService } from "../../shared/services/toast.service";
import { GroupService } from "../../masters/group/group.service";
import { UsersService } from "../../masters/users/users.service";
import { UtilityService } from "../../masters/utility/utility.service";

@Component({
  selector: "app-report-filter",
  templateUrl: "./report-filter.component.html",
  styleUrl: "./report-filter.component.css",
})
export class ReportFilterComponent implements OnInit {
  filterForm: FormGroup | any;
  properties: any[] = [];
  users: any[] = [];
  utilities: any[] = [];
  maxDate: Date = new Date();
  selectedProperty: any = null;
  selectedUser: any = null;
  selectedUtility: any = null;

  constructor(
    public ref: DynamicDialogRef,
    private groupService: GroupService,
    private transactionsService: TransactionsService,
    private datePipe: DatePipe,
    private toastService: ToastService,
    private usersService: UsersService,
    private utilityService: UtilityService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      pgId: new FormControl(""),
      id: new FormControl(""),
      fromDate: new FormControl(""),
      toDate: new FormControl(""),
      utilityId: new FormControl(""),
    });
    this.getAllPropertyGroup();
    this.getAllUsers();
    this.getAllUtilities();
    if (this.config.data) {
      this.filterForm.patchValue({
        fromDate: new Date(this.config.data.fromDate),
        toDate: new Date(this.config.data.toDate),
      });
    }
  }

  getAllPropertyGroup() {
    this.groupService.getAllNotArchivedGroups().subscribe((res: any) => {
      if (res.length > 0) {
        this.properties = res;
        if (this.config.data) {
          this.filterForm.get("pgId").setValue(this.config.data.pgId);
          for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].id == this.config.data.pgId) {
              this.selectedProperty = this.properties[i];
            }
          }
        }
      } else {
        this.toastService.showWarning("No Properties Found.", "Warning");
      }
    });
  }

  getAllUtilities() {
    this.utilityService.getAllUtilities().subscribe((res: any) => {
      if (res.utilityDao.length > 0) {
        this.utilities = res.utilityDao;
        if (this.config.data) {
          this.filterForm.get("utilityId").setValue(this.config.data.utilityId);
          for (let i = 0; i < this.utilities.length; i++) {
            if (this.utilities[i].id == this.config.data.utilityId) {
              this.selectedUtility = this.utilities[i];
            }
          }
        }
      } else {
        this.toastService.showWarning("No Utilities Found.", "Warning");
      }
    });
  }

  onPropertySelect(event: any) {
    this.filterForm.get("pgId").setValue(event.value.id);
  }

  onUtilitySelect(event: any) {
    this.filterForm.get("utilityId").setValue(event.value.id);
  }

  getAllUsers() {
    this.usersService.getAllUsers().subscribe((res: any) => {
      if (res.userDao.length > 0) {
        let allUsers = res.userDao;
        for (let i = 0; i < allUsers.length; i++) {
          allUsers[i].fullName = allUsers[i].firstName + " " + allUsers[i].lastName;
          if (this.config.data) {
            if (this.config.data.id == allUsers[i].id) {
              this.selectedUser = allUsers[i];
              this.filterForm.get("id").setValue(this.config.data.id);
            }
          }
        }
        this.users = allUsers;
      } else {
        this.toastService.showWarning("No Users Found.", "Warning");
      }
    });
  }

  onBatchSelect(event: any) {
    this.filterForm.get("id").setValue(event.value.id);
  }

  applyFilter() {
    // check if all fields are empty
    if (
      !this.filterForm.value.fromDate &&
      !this.filterForm.value.toDate &&
      !this.filterForm.value.pgId &&
      !this.filterForm.value.id &&
      !this.filterForm.value.archived &&
      !this.filterForm.value.utilityId
    ) {
      this.toastService.showWarning("Please enter at least one field.", "Warning");
      return;
    }
    // add validation for from date and to date
    if (
      this.filterForm.value.fromDate &&
      this.filterForm.value.toDate &&
      this.filterForm.value.fromDate > this.filterForm.value.toDate
    ) {
      this.toastService.showWarning("From Date cannot be greater than To Date", "Warning");
      return;
    } else if (this.filterForm.value.fromDate && !this.filterForm.value.toDate) {
      this.toastService.showWarning("Please select To Date", "Warning");
      return;
    } else if (!this.filterForm.value.fromDate && this.filterForm.value.toDate) {
      this.toastService.showWarning("Please select From Date", "Warning");
      return;
    } else {
      if (this.filterForm.value.fromDate && this.filterForm.value.toDate) {
        this.filterForm.value.fromDate = this.datePipe.transform(this.filterForm.value.fromDate, "yyyy-MM-dd");
        this.filterForm.value.toDate = this.datePipe.transform(this.filterForm.value.toDate, "yyyy-MM-dd");
      }
      // if any value is empty then remove it
      Object.keys(this.filterForm.value).forEach((key) => {
        if (!this.filterForm.value[key]) {
          delete this.filterForm.value[key];
        }
      });
      this.ref.close(this.filterForm.value);
    }
  }

  close() {
    this.ref.close("");
  }
}

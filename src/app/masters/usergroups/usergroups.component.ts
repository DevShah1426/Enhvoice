import { Component, OnDestroy } from "@angular/core";
import { HeaderService } from "../../shared/services/header.service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { AddEditUsergroupComponent } from "./add-edit-usergroup/add-edit-usergroup.component";
import { UsergroupsService } from "./usergroups.service";
import { ToastService } from "../../shared/services/toast.service";
import { Subscription } from "rxjs";
import { AlertDialogService } from "../../shared/services/alert-dialog.service";

@Component({
  selector: "app-usergroups",
  templateUrl: "./usergroups.component.html",
  styleUrl: "./usergroups.component.css",
})
export class UsergroupsComponent implements OnDestroy {
  ref: DynamicDialogRef | any;
  groups: any[] = [];
  resultSubscription: Subscription | any;

  constructor(
    private headerService: HeaderService,
    public dialogService: DialogService,
    private usergroupsService: UsergroupsService,
    private toastService: ToastService,
    private alertDialogService: AlertDialogService
  ) {
    this.getAllUserGroups();
    headerService.updateHeader({
      title: "Groups",
      icon: "user-groups",
    });
  }

  ngOnDestroy(): void {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  getAllUserGroups() {
    this.groups = [];
    this.usergroupsService.getAllUserGroups().subscribe((res: any) => {
      this.groups = res.userGroupDao;
    });
  }

  editGroup(group: any) {
    this.ref = this.dialogService.open(AddEditUsergroupComponent, {
      height: "auto",
      width: "85%",
      closable: false,
      showHeader: false,
      position: "center",
      data: group,
    });
    this.ref.onClose.subscribe((result: any) => {
      if (result != "") {
        if (result == "success") {
          this.toastService.showSuccess("Group updated successfully.", "Success");
          this.getAllUserGroups();
        } else {
          this.toastService.showError("Unable to update group details.", "Error");
        }
      }
    });
  }
}

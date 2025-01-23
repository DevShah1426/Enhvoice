import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { UsersService } from "../users.service";
import { UsergroupsService } from "../../usergroups/usergroups.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-add-edit-users",
  templateUrl: "./add-edit-users.component.html",
  styleUrl: "./add-edit-users.component.css",
})
export class AddEditUsersComponent implements OnInit {
  usersForm: FormGroup | any;
  userGroups: any[] = [];
  buttonLabel: string = "Add User";
  selectedUserGroup: any = { id: null, ugpName: "Select" };
  constructor(
    public ref: DynamicDialogRef,
    private usersService: UsersService,
    private usergroupsService: UsergroupsService,
    private messageService: MessageService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.usersForm = new FormGroup({
      firstName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
      lastName: new FormControl(""),
      phone: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      empCode: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(10)]),
      ugpId: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
    this.getAllUserGroups();
  }

  getAllUserGroups() {
    this.userGroups = [];
    this.usergroupsService.getAllUserGroups().subscribe((res: any) => {
      this.userGroups = res.userGroupDao;
      if (this.config.data) {
        for (let i = 0; i < this.userGroups.length; i++) {
          if (this.userGroups[i].id == this.config.data.ugpId) {
            this.selectedUserGroup = this.userGroups[i];
            this.usersForm.get("ugpId").setValue(this.userGroups[i].id);
          }
        }
        this.buttonLabel = "Edit User";
        this.usersForm.patchValue(this.config.data);
        this.usersForm.addControl("id", new FormControl(this.config.data.id));
        this.usersForm.addControl("activeFlag", new FormControl(this.config.data.activeFlag));
      }
    });
  }

  onSelect(event: any) {
    this.usersForm.get("ugpId").setValue(event.value.id);
  }

  addUser() {
    // add new kay roles and against that add [9] as data
    this.usersForm.value.roleIds = ["9"];
    // trim the spaces
    this.usersForm.value.firstName = this.usersForm.value.firstName.trim();
    this.usersForm.value.lastName = this.usersForm.value.lastName.trim();
    this.usersForm.value.phone = this.usersForm.value.phone.trim();
    this.usersForm.value.email = this.usersForm.value.email.trim();
    this.usersForm.value.empCode = this.usersForm.value.empCode.trim();
    this.usersForm.value.username = this.usersForm.value.username.trim();
    this.usersForm.value.password = this.usersForm.value.password.trim();
    // username could not contain space
    if (this.usersForm.value.username.indexOf(" ") >= 0) {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Username should not contain space" });
      return;
    }
    this.usersService.saveUsers(this.usersForm.value).subscribe((res: any) => {
      if (res.status.toLowerCase() == "success") {
        this.ref.close(res);
      } else {
        // this.ref.close(res);
        this.messageService.add({ severity: "error", summary: res.status, detail: res.message });
      }
    });
  }

  close() {
    this.ref.close("");
  }
}

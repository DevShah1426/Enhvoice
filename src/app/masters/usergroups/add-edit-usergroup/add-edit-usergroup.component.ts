import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { UsergroupsService } from "../usergroups.service";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-add-edit-usergroup",
  templateUrl: "./add-edit-usergroup.component.html",
  styleUrl: "./add-edit-usergroup.component.css",
})
export class AddEditUsergroupComponent implements OnInit {
  permissionsForm: FormGroup | any;
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private fb: FormBuilder,
    private usergroupsService: UsergroupsService,
    private toastService: ToastService
  ) {}
  permissions: any[] = [
    {
      title: "Upload",
      description: "Allows user full access to review and activate",
      icon: "auditing",
      permission: true,
      form: "upload",
    },
    {
      title: "Verify",
      description: "Allows user full access to review and modify documents",
      icon: "auditing",
      permission: true,
      form: "verify",
    },

    // Property Group
    {
      title: "View Property",
      description: "Managing system settings and security policies",
      icon: "schuffle",
      permission: true,
      form: "viewPropertyGroup",
    },
    {
      title: "Add Property",
      description: "Managing system settings and security policies",
      icon: "schuffle",
      permission: true,
      form: "addPropertyGroup",
    },
    {
      title: "Property Archive / Unarchive",
      description: "Managing system settings and security policies",
      icon: "schuffle",
      permission: true,
      form: "archiveUnarchiveProperty",
    },

    // Property
    {
      title: "View Service Address",
      description: "Creating, modifying, and deleting user accounts and groups",
      icon: "user-groups",
      permission: true,
      form: "viewProperty",
    },
    {
      title: "Add Service Address",
      description: "Creating, modifying, and deleting user accounts and groups",
      icon: "user-groups",
      permission: true,
      form: "addProperty",
    },
    {
      title: "Service Address Archive / Unarchive",
      description: "Creating, modifying, and deleting user accounts and groups",
      icon: "user-groups",
      permission: true,
      form: "propertyArchiveUnarchive",
    },

    // Users
    {
      title: "View Users",
      description: "Allows user full access to review and activate",
      icon: "restore",
      permission: true,
      form: "viewUsers",
    },
    {
      title: "Add Users",
      description: "Allows user full access to review and activate",
      icon: "restore",
      permission: true,
      form: "addUsers",
    },

    // User Group
    {
      title: "View User Group",
      description: "Grant or restrict user access",
      icon: "users",
      permission: true,
      form: "viewUserGroup",
    },
    {
      title: "Add User Group",
      description: "Grant or restrict user access",
      icon: "users",
      permission: true,
      form: "addUserGroup",
    },

    // Template Creation
    {
      title: "Create Template",
      description: "Allows user full access to review and activate assets",
      icon: "field",
      permission: true,
      form: "template",
    },

    // View Template
    {
      title: "View Template",
      description: "Allows user full access to review and activate assets",
      icon: "field",
      permission: true,
      form: "viewTemplate",
    },
    {
      title: "Add Template",
      description: "Allows user full access to review and activate assets",
      icon: "field",
      permission: true,
      form: "addAssociation",
    },

    // Providers
    {
      title: "View Providers",
      description: "Grant or restrict user access",
      icon: "users",
      permission: true,
      form: "viewProvider",
    },
    {
      title: "Add Providers",
      description: "Grant or restrict user access",
      icon: "users",
      permission: true,
      form: "addProvider",
    },

    // Utilities
    {
      title: "View Utilities",
      description: "Grant or restrict user access",
      icon: "users",
      permission: true,
      form: "viewUtilities",
    },
    {
      title: "Add Utilities",
      description: "Grant or restrict user access",
      icon: "users",
      permission: true,
      form: "addUtilities",
    },

    // Report
    {
      title: "Reports",
      description: "Allows user full access to review and activate",
      icon: "restore",
      permission: true,
      form: "reports",
    },

    // Audit Log
    {
      title: "Audit Logs",
      description: "Allows user full access to review and activate",
      icon: "restore",
      permission: true,
      form: "auditLogs",
    },
  ];
  ngOnInit(): void {
    this.permissionsForm = new FormGroup({
      ugpName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      ugpDetails: new FormControl(""),
      upload: new FormControl(false),
      process: new FormControl(false),
      verify: new FormControl(false),
      dashboard: new FormControl(false),
      viewProperty: new FormControl(false),
      addProperty: new FormControl(false),
      propertyArchiveUnarchive: new FormControl(false),
      viewPropertyGroup: new FormControl(false),
      addPropertyGroup: new FormControl(false),
      archiveUnarchiveProperty: new FormControl(false),
      viewUserGroup: new FormControl(false),
      addUserGroup: new FormControl(false),
      viewTemplate: new FormControl(false),
      addAssociation: new FormControl(false),
      viewProvider: new FormControl(false),
      addProvider: new FormControl(false),
      viewUtilities: new FormControl(false),
      addUtilities: new FormControl(false),
      template: new FormControl(false),
      reports: new FormControl(false),
      viewUsers: new FormControl(false),
      addUsers: new FormControl(false),
      auditLogs: new FormControl(false),
    });
    if (this.config.data) {
      let permissions = JSON.parse(this.config.data.permissions);
      this.permissionsForm.patchValue({
        ugpName: this.config.data.ugpName,
        ugpDetails: this.config.data.ugpDetails,
        upload: permissions.upload,
        process: permissions.process,
        verify: permissions.verify,
        dashboard: permissions.dashboard,
        propertyArchiveUnarchive: permissions.propertyArchiveUnarchive,
        template: permissions.template,
        reports: permissions.reports,
        auditLogs: permissions.auditLogs,
        viewProperty: permissions.viewProperty,
        addProperty: permissions.addProperty,
        viewPropertyGroup: permissions.viewPropertyGroup,
        addPropertyGroup: permissions.addPropertyGroup,
        archiveUnarchiveProperty: permissions.archiveUnarchiveProperty,
        viewUserGroup: permissions.viewUserGroup,
        addUserGroup: permissions.addUserGroup,
        viewTemplate: permissions.viewTemplate,
        addAssociation: permissions.addAssociation,
        viewProvider: permissions.viewProvider,
        addProvider: permissions.addProvider,
        viewUtilities: permissions.viewUtilities,
        addUtilities: permissions.addUtilities,
        viewUsers: permissions.viewUsers,
        addUsers: permissions.addUsers,
      });
    }
  }

  close() {
    this.ref.close("");
  }

  triggerAction() {
    // trim the spaces
    this.permissionsForm.value.ugpName = this.permissionsForm.value.ugpName.trim();

    // if length of any field is 0 after trim then set value to empty
    if (this.permissionsForm.value.ugpName.length == 0) {
      this.permissionsForm.get("ugpName").setValue("");
    }

    // check if form is valid
    if (!this.permissionsForm.valid) {
      this.toastService.showWarning("Group name is required", "Warning");
      return;
    }
    if (this.config.data) {
      this.updatePermissions();
    } else {
      this.save();
    }
  }

  save() {
    const formValue = this.permissionsForm.value;
    let permissions = JSON.stringify({
      upload: formValue.upload,
      process: formValue.process,
      verify: formValue.verify,
      dashboard: formValue.dashboard,
      propertyArchiveUnarchive: formValue.propertyArchiveUnarchive,
      template: formValue.template,
      reports: formValue.reports,
      auditLogs: formValue.auditLogs,
      viewProperty: formValue.viewProperty,
      addProperty: formValue.addProperty,
      viewPropertyGroup: formValue.viewPropertyGroup,
      addPropertyGroup: formValue.addPropertyGroup,
      archiveUnarchiveProperty: formValue.archiveUnarchiveProperty,
      viewUserGroup: formValue.viewUserGroup,
      addUserGroup: formValue.addUserGroup,
      viewTemplate: formValue.viewTemplate,
      addAssociation: formValue.addAssociation,
      viewProvider: formValue.viewProvider,
      addProvider: formValue.addProvider,
      viewUtilities: formValue.viewUtilities,
      addUtilities: formValue.addUtilities,
      viewUsers: formValue.viewUsers,
      addUsers: formValue.addUsers,
    });
    let transformedData: any = {
      ugpName: formValue.ugpName,
      ugpDetails: formValue.ugpDetails,
      permissions: permissions,
    };
    this.usergroupsService.saveUserGroups(transformedData).subscribe((res: any) => {
      if (res.status.toLowerCase() == "success") {
        this.ref.close("success");
      } else {
        this.ref.close("failed");
      }
    });
  }

  updatePermissions() {
    const formValue = this.permissionsForm.value;
    let permissions = JSON.stringify({
      upload: formValue.upload,
      process: formValue.process,
      verify: formValue.verify,
      dashboard: formValue.dashboard,
      propertyArchiveUnarchive: formValue.propertyArchiveUnarchive,
      template: formValue.template,
      reports: formValue.reports,
      auditLogs: formValue.auditLogs,
      viewProperty: formValue.viewProperty,
      addProperty: formValue.addProperty,
      viewPropertyGroup: formValue.viewPropertyGroup,
      addPropertyGroup: formValue.addPropertyGroup,
      archiveUnarchiveProperty: formValue.archiveUnarchiveProperty,
      viewUserGroup: formValue.viewUserGroup,
      addUserGroup: formValue.addUserGroup,
      viewTemplate: formValue.viewTemplate,
      addAssociation: formValue.addAssociation,
      viewProvider: formValue.viewProvider,
      addProvider: formValue.addProvider,
      viewUtilities: formValue.viewUtilities,
      addUtilities: formValue.addUtilities,
      viewUsers: formValue.viewUsers,
      addUsers: formValue.addUsers,
    });
    let transformedData: any = {
      ugpName: formValue.ugpName,
      ugpDetails: formValue.ugpDetails,
      permissions: permissions,
    };
    transformedData["id"] = this.config.data.id;
    transformedData["activeFlag"] = this.config.data.activeFlag;
    this.usergroupsService.updateUserGroups(transformedData).subscribe((res: any) => {
      if (res.status.toLowerCase() == "success") {
        this.ref.close("success");
      } else {
        this.ref.close("failed");
      }
    });
  }

  onSelect(event: any) {
    this.permissionsForm.get("viewMembers").setValue(event.value);
  }
}

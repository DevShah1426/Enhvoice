import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TransactionsService } from "../transactions.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProviderService } from "../../masters/provider/provider.service";
import { GroupService } from "../../masters/group/group.service";
import { UtilityService } from "../../masters/utility/utility.service";

@Component({
  selector: "app-template-selection",
  templateUrl: "./template-selection.component.html",
  styleUrl: "./template-selection.component.css",
})
export class TemplateSelectionComponent implements OnInit {
  templates: any[] = [];
  @Input() filesToUpload: any[] = [];
  @Output() closeDialog = new EventEmitter<any>();
  fileColors: any[] = ["#0475DD", "#DF9300"];
  templatesPerPage = 9;
  currentPageIndex = 1;
  selectedTemplate: any = null;
  allTemplates: any[] = [];
  filteredTemplates: any[] = [];

  properties: any[] = [];
  selectedProperty: any = null;

  providers: any[] = [];
  selectedProvider: any = null;

  utilities: any[] = [];
  selectedUtility: any = null;

  templateForm: FormGroup | any;

  constructor(
    private transactionsService: TransactionsService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private groupService: GroupService,
    private providerService: ProviderService,
    private utilityService: UtilityService
  ) {
    this.templates = this.allTemplates.slice(0, this.templatesPerPage);
  }
  ngOnInit(): void {
    this.templateForm = new FormGroup({
      propertyId: new FormControl("", [Validators.required]),
      providerId: new FormControl("", [Validators.required]),
      utilityId: new FormControl("", [Validators.required]),
    });
    this.selectedTemplate = this.allTemplates[0];
    this.getAllTemplates();
    this.getProperties();
    this.getProviders();
    this.getUtilities();
  }

  onPropertySelect(event: any) {
    this.templateForm.get("propertyId").setValue(event.value.id);
    this.getTemplateByProperty();
  }

  showProviderUtility: boolean = true;
  getTemplateByProperty() {
    this.templates = [];
    this.allTemplates = [];
    this.filteredTemplates = [];
    this.templateForm.get("providerId").setValue("");
    this.templateForm.get("utilityId").setValue("");
    this.selectedProvider = null;
    this.selectedUtility = null;
    this.showProviderUtility = false;
    this.transactionsService.getTemplateByPropertyId(this.templateForm.get("propertyId").value).subscribe(
      (response: any) => {
        this.showProviderUtility = true;
        this.templates = response.ocrTemplateDao;
        this.filteredTemplates = JSON.parse(JSON.stringify(this.templates));
        this.selectedTemplate = this.templates[0];
        this.allTemplates = this.templates;
      },
      (error) => {
        this.showProviderUtility = true;
      }
    );
  }

  onProviderSelect(event: any) {
    this.templateForm.get("providerId").setValue(event.value.id);
    this.filterTemplates();
  }

  onUtilitySelect(event: any) {
    this.templateForm.get("utilityId").setValue(event.value.id);
    this.filterTemplates();
  }

  filterTemplates() {
    this.selectedTemplate = null;
    if (
      this.templateForm.get("propertyId").value == "" &&
      this.templateForm.get("providerId").value == "" &&
      this.templateForm.get("utilityId").value == ""
    ) {
      this.templates = this.allTemplates;
      this.filteredTemplates = JSON.parse(JSON.stringify(this.allTemplates));
      return;
    } else if (this.templateForm.get("providerId").value != "" && this.templateForm.get("utilityId").value == "") {
      this.templates = this.allTemplates.filter((template) => {
        return template.providerId == this.templateForm.get("providerId").value;
      });
      this.filteredTemplates = this.templates;
      return;
    } else if (this.templateForm.get("providerId").value == "" && this.templateForm.get("utilityId").value != "") {
      this.templates = this.allTemplates.filter((template) => {
        return template.utilityId == this.templateForm.get("utilityId").value;
      });
      this.filteredTemplates = this.templates;
      return;
    } else if (this.templateForm.get("providerId").value != "" && this.templateForm.get("utilityId").value != "") {
      this.templates = this.allTemplates.filter((template) => {
        return (
          template.providerId == this.templateForm.get("providerId").value &&
          template.utilityId == this.templateForm.get("utilityId").value
        );
      });
      this.filteredTemplates = this.templates;
      return;
    }
  }

  getProperties() {
    this.groupService.getAllNotArchivedGroups().subscribe((res: any) => {
      this.properties = res;
    });
  }

  getProviders() {
    this.providerService.getAllProviders().subscribe((res: any) => {
      this.providers = res.providerDao;
    });
  }

  getUtilities() {
    this.utilityService.getAllUtilities().subscribe((res: any) => {
      this.utilities = res.utilityDao;
    });
  }

  getAllTemplates() {
    this.allTemplates = [];
    this.filteredTemplates = [];
    this.transactionsService.getAllTemplatesV1().subscribe((res: any) => {
      if (res.ocrTemplateDao.length > 0) {
        this.allTemplates = res.ocrTemplateDao;
        this.filteredTemplates = JSON.parse(JSON.stringify(res.ocrTemplateDao));
        this.templates = this.allTemplates.slice(0, this.templatesPerPage);
        this.selectedTemplate = this.allTemplates[0];
      } else {
        this.allTemplates = [];
        this.filteredTemplates = [];
        this.templates = [];
        this.selectedTemplate = null;
        this.messageService.add({ severity: "error", summary: "No Templates Found.", detail: "" });
      }
    });
  }

  loadNextTemplates() {
    if (this.filteredTemplates.length <= 9) return;
    const startIndex = this.currentPageIndex * 9;
    const endIndex = Math.min(startIndex + 9, this.filteredTemplates.length);

    this.templates = this.filteredTemplates.slice(startIndex, endIndex);
    this.currentPageIndex++;
  }

  loadPreviousTemplates() {
    if (this.filteredTemplates.length <= 9) return;
    const startIndex = Math.max((this.currentPageIndex - 2) * 9, 0); // Ensures valid index for first page
    const endIndex = Math.min(startIndex + 9, this.filteredTemplates.length);

    this.templates = this.filteredTemplates.slice(startIndex, endIndex);
    this.currentPageIndex = Math.max(this.currentPageIndex - 1, 1); // Avoid negative page numbers
  }

  fileStatus: any[] = [];
  async uploadFiles() {
    if (this.selectedTemplate == null) {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Please select a template." });
      return;
    }
    this.fileStatus = [];
    const epochNow = new Date().getTime();
    let date = this.datePipe.transform(new Date(), "yyyyMMddHHmmss");
    let dateString = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
    for (const file of this.filesToUpload) {
      try {
        const res: any = await this.transactionsService
          .uploadFiles(this.selectedTemplate.id, [file], date, dateString)
          .toPromise();

        if (
          res.status.toLowerCase() === "success" ||
          res.status.toLowerCase() === "uploaded" ||
          res.status.toLowerCase() === "property_not_found"
        ) {
          this.fileStatus.push({
            fileName: file.name,
            status: res.status,
          });
        } else {
          this.messageService.add({ severity: "error", summary: "Error", detail: "Files not uploaded." });
          return;
        }
      } catch (error) {
        return;
      }
    }

    setTimeout(() => {
      if (this.filesToUpload.length === this.fileStatus.length) {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Files uploaded successfully.",
        });
        localStorage.removeItem("selectedFolder");
        localStorage.removeItem("filter");
        localStorage.removeItem("searchText");
        localStorage.removeItem("activeSelection");
        setTimeout(() => {
          this.close();
        }, 1000);
      } else {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Files not uploaded." });
      }
    }, 1000);
  }

  removeFile(index: any) {
    this.filesToUpload.splice(index, 1);
  }

  close() {
    this.closeDialog.emit();
  }

  selectTemplate(template: any) {
    this.selectedTemplate = template;
  }
}

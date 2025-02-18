import { Component } from "@angular/core";
import { HeaderService } from "../../shared/services/header.service";
import { TransactionsService } from "../transactions.service";
import { TransactionFilterComponent } from "./transaction-filter/transaction-filter.component";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToastService } from "../../shared/services/toast.service";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrl: "./transactions.component.css",
})
export class TransactionsComponent {
  selectedFolder: any = null;
  folderListVisible: boolean = false;
  transactionsVisible: boolean = true;
  ref: DynamicDialogRef | any;
  selectButtonOptions: any[] = [
    {
      label: "BatchWise",
      value: "batch",
    },
    {
      label: "PropertyWise",
      value: "property",
    },
  ];
  activeSelection: string = this.selectButtonOptions[0].value;
  filterBody: any = {};
  requestChangeFolder: any = null;
  searchText: string = "";
  propertyNameSearchText: string = "";
  constructor(
    private headerService: HeaderService,
    private transactionsService: TransactionsService,
    public dialogService: DialogService,
    private toastService: ToastService
  ) {
    headerService.updateHeader({
      title: "Dashboard",
      icon: "transactions",
    });
    this.filterBody = {
      year: new Date().getFullYear(),
    };
    let activeSelection = localStorage.getItem("activeSelection");
    if (activeSelection) {
      this.activeSelection = activeSelection;
      let filter = localStorage.getItem("filter");
      if (filter) {
        this.filterBody = JSON.parse(filter);
      }
      if (activeSelection == "property") {
        this.getAllUploadedFilesByProperty();
      } else {
        this.getAllUploadedFilesByBatch();
      }
    } else {
      localStorage.setItem("activeSelection", "batch");
      this.getAllUploadedFilesByBatch();
    }
  }

  recentUploads: any[] = [];

  uploadedFolders: any[] = [];
  allRecords: any[] = [];

  getFolderDetails(event: any) {
    localStorage.setItem("selectedFolder", JSON.stringify(event));
    this.selectedFolder = event;
  }

  uploadFile() {
    this.transactionsVisible = false;
  }

  onSelectionChange(value: string) {
    localStorage.removeItem("selectedFolder");
    localStorage.setItem("activeSelection", value);
    localStorage.removeItem("filter");
    localStorage.removeItem("searchText");
    localStorage.removeItem("propertyNameSearchText");
    this.searchText = "";
    this.propertyNameSearchText = "";
    this.activeSelection = value;
    this.filterBody = "";
    if (value == "batch") {
      this.filterBody = {
        year: new Date().getFullYear(),
      };
      this.getAllUploadedFilesByBatch();
    } else {
      this.filterBody = {
        year: new Date().getFullYear(),
      };
      this.getAllUploadedFilesByProperty();
    }
  }

  onRequestChange(value: any) {
    this.activeSelection = value.activeSelection;
    this.requestChangeFolder = value.selectedFolder.folderName;
    // this.filterBody = "";
    if (value.activeSelection == "batch") {
      this.getAllUploadedFilesByBatch();
    } else {
      this.getAllUploadedFilesByProperty();
    }
  }

  getAllUploadedFilesByBatch() {
    this.uploadedFolders = [];
    this.allRecords = [];
    this.selectedFolder = null;
    if (!this.filterBody) {
      this.filterBody = {
        year: new Date().getFullYear(),
      };
    }
    this.transactionsService.getBatchWiseTransactions(this.filterBody).subscribe((res: any) => {
      if (res.length == 0) {
        this.toastService.showWarning("No data available for selected filter", "Warning");
        localStorage.removeItem("selectedFolder");
        return;
      }
      this.uploadedFolders = res;
      this.allRecords = res;
      this.folderListVisible = false;
      setTimeout(() => {
        if (this.requestChangeFolder) {
          const index = this.uploadedFolders.findIndex((folder: any) => folder.folderName === this.requestChangeFolder);
          this.selectedFolder = this.uploadedFolders[index];
          this.requestChangeFolder = null;
        } else {
          let previousSelectedFolder = localStorage.getItem("selectedFolder");
          if (previousSelectedFolder) {
            // iterate over all records and filter out based on search text on serviceBlockAddress and pgName
            for (let i = 0; i < this.uploadedFolders.length; i++) {
              if (this.uploadedFolders[i].folderName == JSON.parse(previousSelectedFolder).folderName) {
                this.selectedFolder = this.uploadedFolders[i];
                break;
              }
            }
            if (this.selectedFolder == null) {
              this.selectedFolder = this.uploadedFolders[0];
            }
          } else {
            this.selectedFolder = this.uploadedFolders[0];
          }
        }
        this.folderListVisible = true;
      }, 100);
    });
  }

  getAllUploadedFilesByProperty() {
    this.uploadedFolders = [];
    this.allRecords = [];
    this.selectedFolder = null;
    if (!this.filterBody) {
      this.filterBody = {
        year: new Date().getFullYear(),
      };
    }
    this.transactionsService.getPropertyWiseTransactions(this.filterBody).subscribe((res: any) => {
      if (res.length == 0) {
        this.toastService.showWarning("No data available for selected filter", "Warning");
        localStorage.removeItem("selectedFolder");
        return;
      }
      this.uploadedFolders = res;
      this.allRecords = res;
      this.folderListVisible = false;
      setTimeout(() => {
        if (this.requestChangeFolder) {
          const index = this.uploadedFolders.findIndex((folder: any) => folder.folderName === this.requestChangeFolder);
          this.selectedFolder = this.uploadedFolders[index];
          this.requestChangeFolder = null;
        } else {
          let previousSelectedFolder = localStorage.getItem("selectedFolder");
          if (previousSelectedFolder) {
            for (let i = 0; i < this.uploadedFolders.length; i++) {
              if (this.uploadedFolders[i].folderName == JSON.parse(previousSelectedFolder).folderName) {
                this.selectedFolder = this.uploadedFolders[i];
                break;
              }
            }
            if (this.selectedFolder == null) {
              this.selectedFolder = this.uploadedFolders[0];
            }
          } else {
            this.selectedFolder = this.uploadedFolders[0];
          }
        }
        this.folderListVisible = true;
        let searchText = localStorage.getItem("searchText");
        if (searchText) {
          this.searchText = searchText;
        }

        let propertyNameSearchText = localStorage.getItem("propertyNameSearchText");
        if (propertyNameSearchText) {
          this.propertyNameSearchText = propertyNameSearchText;
        }
        this.onSearchTextChange(this.searchText, this.propertyNameSearchText);
      }, 100);
    });
  }

  toggleTransactionVisibility() {
    this.transactionsVisible = !this.transactionsVisible;
    if (this.transactionsVisible) {
      if (this.activeSelection == "batch") {
        this.getAllUploadedFilesByBatch();
      } else {
        this.getAllUploadedFilesByProperty();
      }
    }
  }

  openFilter() {
    this.ref = this.dialogService.open(TransactionFilterComponent, {
      height: "auto",
      width: "30%",
      closable: true,
      showHeader: false,
      position: "center",
      focusOnShow: false,
      data: this.filterBody,
    });
    this.ref.onClose.subscribe((result: any) => {
      if (result) {
        if (result != "close") {
          // append result to filterBody
          this.filterBody = { ...this.filterBody, ...result };
        }
        if (this.activeSelection == "batch") {
          this.getAllUploadedFilesByBatch();
        } else {
          this.getAllUploadedFilesByProperty();
        }
      }
    });
  }

  onFilter(event: any, type: string) {
    if ("clear" in event) {
      localStorage.removeItem("searchText");
      localStorage.removeItem("propertyNameSearchText");
      this.searchText = "";
      this.propertyNameSearchText = "";
    }
    this.filterBody = event;
    localStorage.setItem("filter", JSON.stringify(event));
    if (type == "batch") {
      this.getAllUploadedFilesByBatch();
    } else {
      this.getAllUploadedFilesByProperty();
    }
  }

  // onSearchTextChange(searchText: any) {
  //   if (searchText) {
  //     localStorage.setItem("searchText", searchText);
  //     const searchResults = this.allRecords
  //       .map((folder) => {
  //         // Filter files based on the search text (case-insensitive)
  //         const matchingFiles = folder.files.filter(
  //           (file: any) => file.accountNumber && file.accountNumber.toLowerCase() === searchText.toLowerCase()
  //         );

  //         // Return the folder with matching files if there are any
  //         return matchingFiles.length > 0 ? { ...folder, files: matchingFiles } : null;
  //       })
  //       // Remove folders with no matches
  //       .filter((result) => result !== null);

  //     this.uploadedFolders = searchResults;
  //     this.selectedFolder = this.uploadedFolders[0];
  //     if (searchResults.length == 0) {
  //       // this.toastService.show({
  //       //   severity: "error",
  //       //   summary: "No Results Found",
  //       //   detail: "Please try with different search criteria",
  //       // });
  //     }
  //   } else {
  //     localStorage.removeItem("searchText");
  //     this.uploadedFolders = this.allRecords;
  //     this.selectedFolder = this.uploadedFolders[0];
  //   }
  // }

  // onPropertyNameSearchTextChange(searchText: any) {
  //   if (searchText) {
  //     localStorage.setItem("propertyNameSearchText", searchText);
  //     const lowerSearchText = searchText.toLowerCase();
  //     let filteredDataList = [];

  //     filteredDataList = this.allRecords
  //       .map((group) => ({
  //         ...group,
  //         files: group.files.filter(
  //           (file: any) => file.propertyName && file.propertyName.toLowerCase().includes(lowerSearchText)
  //         ),
  //       }))
  //       .filter((group) => group.files.length > 0); // Remove empty groups

  //     this.uploadedFolders = filteredDataList;
  //     this.selectedFolder = this.uploadedFolders[0];
  //     if (filteredDataList.length == 0) {
  //       // this.toastService.show({
  //       //   severity: "error",
  //       //   summary: "No Results Found",
  //       //   detail: "Please try with different search criteria",
  //       // });
  //     }
  //   } else {
  //     localStorage.removeItem("propertyNameSearchText");
  //     this.uploadedFolders = this.allRecords;
  //     this.selectedFolder = this.uploadedFolders[0];
  //   }
  // }

  onSearchTextChange(searchText: any, propertySearchText: any) {
    this.searchText = searchText;
    this.propertyNameSearchText = propertySearchText;
    // Store the search texts in localStorage
    if (searchText) {
      localStorage.setItem("searchText", searchText);
    } else {
      localStorage.removeItem("searchText");
    }

    if (propertySearchText) {
      localStorage.setItem("propertyNameSearchText", propertySearchText);
    } else {
      localStorage.removeItem("propertyNameSearchText");
    }

    // Filter the records based on both search texts (if provided)
    let filteredDataList = this.allRecords;

    // If searchText is provided, filter based on accountNumber
    if (searchText) {
      filteredDataList = filteredDataList
        .map((folder) => {
          const matchingFiles = folder.files.filter(
            (file: any) => file.accountNumber && file.accountNumber.toLowerCase() === searchText.toLowerCase()
          );
          return matchingFiles.length > 0 ? { ...folder, files: matchingFiles } : null;
        })
        .filter((result) => result !== null);
    }

    // If propertySearchText is provided, filter based on propertyName
    if (propertySearchText) {
      const lowerSearchText = propertySearchText.toLowerCase();
      filteredDataList = filteredDataList
        .map((group) => ({
          ...group,
          files: group.files.filter(
            (file: any) => file.propertyName && file.propertyName.toLowerCase().includes(lowerSearchText)
          ),
        }))
        .filter((group) => group.files.length > 0); // Remove empty groups
    }

    // Update the state with the filtered results
    this.uploadedFolders = filteredDataList;
    this.selectedFolder = this.uploadedFolders.length > 0 ? this.uploadedFolders[0] : null;

    // If no results found, you can show an error message
    if (filteredDataList.length === 0) {
      localStorage.removeItem("searchText");
      localStorage.removeItem("propertyNameSearchText");
      // this.toastService.show({
      //   severity: "error",
      //   summary: "No Results Found",
      //   detail: "Please try with different search criteria",
      // });
    }
  }
}

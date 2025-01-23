import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { environment } from "../../../../environments/environment";
import { TransactionsService } from "../../../transactions/transactions.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-pdf-viewer",
  templateUrl: "./pdf-viewer.component.html",
  styleUrl: "./pdf-viewer.component.css",
})
export class PdfViewerComponent implements AfterViewInit {
  @Input() filePath: string = "";
  pdfSrc: SafeHtml = "";

  constructor(
    private sanitizer: DomSanitizer,
    private transactionsService: TransactionsService,
    private messageService: MessageService
  ) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      let url = environment.serverUrl;
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url + this.filePath);
      if (this.filePath) {
        this.downloadFile();
      }
    }, 1000);
  }

  downloadFile() {
    this.transactionsService.downloadDocFile(this.filePath).subscribe((data: any) => {
      let blob = new Blob([data], { type: "application/pdf" });
      let fileURL: any = URL.createObjectURL(blob);
      fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
      this.pdfSrc = fileURL;
    });
  }
}

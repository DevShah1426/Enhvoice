import { Component, OnInit } from "@angular/core";
import { HeaderService } from "../../shared/services/header.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TransactionsService } from "../transactions.service";

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrl: "./result.component.css",
})
export class ResultComponent implements OnInit {
  transactionId: any = null;
  filePath: string = "";
  constructor(
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private transactionsService: TransactionsService,
    private router: Router
  ) {
    headerService.updateHeader({
      title: "Transactions",
      icon: "file",
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((event) => {
      this.transactionId = event["id"];
      if (this.transactionId) {
        this.getDataByTransactionId();
      } else {
        this.router.navigate(["/enhancor/transactions"]);
      }
    });
  }

  getDataByTransactionId() {
    this.transactionsService.getDataByTransactionId(this.transactionId).subscribe((data: any) => {
      this.filePath = data.filePath;
    });
  }

  back() {
    this.router.navigate(["/enhancor/transactions"]);
  }
}

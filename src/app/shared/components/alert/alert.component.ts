import { Component, Inject, OnInit } from "@angular/core";
import { AlertDetails } from "../../models/alert-details";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Router } from "@angular/router";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrl: "./alert.component.css",
})
export class AlertComponent implements OnInit {
  usrFullName = localStorage.getItem("userFullName");
  alertDetails: AlertDetails = new AlertDetails();
  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef, private router: Router) {}
  ngOnInit(): void {
    this.alertDetails = this.config.data;
  }

  close() {
    this.ref.close("");
  }

  ok() {
    if (this.alertDetails.routerLink) {
      this.router.navigate([this.alertDetails.routerLink]);
    }
    this.ref.close("ok");
  }
}

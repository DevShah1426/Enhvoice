import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { LoginService } from "./login.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { PermissionService } from "../../shared/services/permission.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(""),
      password: new FormControl(""),
      captcha: new FormControl(""),
    });
  }

  login() {
    if (!this.loginForm.value.username || !this.loginForm.value.password || !this.loginForm.value.captcha) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter all fields.",
      });
      return;
    }
    this.loginService.login(this.loginForm.value).subscribe((response: any) => {
      if (response.token != "") {
        if (response.permissions) {
          this.permissionService.setPermissions(JSON.parse(response.permissions));
        }
        this.loginService.setAuthentication(true);
        localStorage.setItem("ugpId", response.ugpId);
        localStorage.setItem("authToken", response?.token.toString());
        localStorage.setItem("usrId", response?.id);
        localStorage.setItem("usrName", response?.username);
        localStorage.setItem("userFullName", response?.userFullName);
        localStorage.setItem("userId", response?.id);
        this.router.navigate(["/enhancor/transactions"]);
      }
    });
  }
}

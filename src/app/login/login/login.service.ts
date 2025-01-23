import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private authSource = new BehaviorSubject<boolean>(false);
  authFlag = this.authSource.asObservable();

  constructor(private router: Router, private httpClient: HttpClient) {}
  login(body: any) {
    return this.httpClient.post(environment.serverUrl + "/auth/signin", body);
  }

  logout(): void {
    this.authSource.next(false);
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(["/"]);
  }

  isAuthenticated(): boolean {
    let isUserAuthenticated = localStorage.getItem("authToken");
    if (isUserAuthenticated != null) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  setAuthentication(auth: boolean) {
    this.authSource.next(auth);
  }
}

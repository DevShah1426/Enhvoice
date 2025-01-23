import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChangePasswordService {
  constructor(private httpClient: HttpClient) {}

  changePassword(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/user/changePassword", body);
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private httpClient: HttpClient) {}

  getAllUsers() {
    return this.httpClient.get(environment.serverUrl + "/api/user/getAllV2");
  }

  saveUsers(body: any) {
    return this.httpClient.post(environment.serverUrl + "/auth/signup", body);
  }

  deleteUser(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/user/delete", body);
  }

  resetPassword(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/user/changePasswordByAdmin", body);
  }
}

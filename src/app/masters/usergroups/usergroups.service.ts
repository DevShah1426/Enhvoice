import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsergroupsService {
  constructor(private httpClient: HttpClient) {}

  getAllUserGroups() {
    return this.httpClient.get(environment.serverUrl + "/api/userGroup/getAll");
  }

  saveUserGroups(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/userGroup/save", body);
  }

  updateUserGroups(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/userGroup/update", body);
  }

  deleteUserGroups(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/userGroup/delete", body);
  }
}

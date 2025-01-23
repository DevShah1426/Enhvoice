import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GroupService {
  constructor(private httpClient: HttpClient) {}

  getAllGroups() {
    return this.httpClient.get(environment.serverUrl + "/api/propertyGroup/getAll");
  }

  getAllArchivedGroups() {
    return this.httpClient.get(environment.serverUrl + "/api/propertyGroup/getAllArchivedPropertyGroup");
  }

  getAllNotArchivedGroups() {
    return this.httpClient.get(environment.serverUrl + "/api/propertyGroup/getAllNotArchivedPropertyGroup");
  }

  saveGroups(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/propertyGroup/save", body);
  }

  archiveGroup(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/propertyGroup/archiveYn", body);
  }

  deleteGroup(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/propertyGroup/delete", body);
  }
}

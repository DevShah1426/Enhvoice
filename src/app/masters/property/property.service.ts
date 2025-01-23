import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PropertyService {
  constructor(private httpClient: HttpClient) {}

  getAllProperties() {
    return this.httpClient.get(environment.serverUrl + "/api/property/getAll");
  }

  getAllNotArchivedProperty() {
    return this.httpClient.get(environment.serverUrl + "/api/property/getAllNotArchivedProperty");
  }

  saveProperty(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/property/save", body);
  }

  deleteProperty(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/property/delete", body);
  }

  saveAccountNumber(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/accountNumber/save", body);
  }

  deleteAccountNumber(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/accountNumber/delete", { id: body });
  }

  getAllAccountNumber(id: any) {
    return this.httpClient.get(environment.serverUrl + "/api/accountNumber/getAllByPropertyId?id=" + id);
  }
}

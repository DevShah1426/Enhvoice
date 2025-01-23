import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UtilityService {
  constructor(private httpClient: HttpClient) {}

  getAllUtilities() {
    return this.httpClient.get(environment.serverUrl + "/api/utility/getAll");
  }

  saveUtilities(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/utility/save", body);
  }

  deleteUtility(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/utility/delete", body);
  }
}

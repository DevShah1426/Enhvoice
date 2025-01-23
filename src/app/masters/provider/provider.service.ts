import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProviderService {
  constructor(private httpClient: HttpClient) {}

  getAllProviders() {
    return this.httpClient.get(environment.serverUrl + "/api/provider/getAll");
  }

  saveProvider(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/provider/save", body);
  }

  deleteProvider(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/provider/delete", body);
  }
}

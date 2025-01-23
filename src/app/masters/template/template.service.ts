import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class TemplateService {
  constructor(private httpClient: HttpClient) {}

  getAll() {
    return this.httpClient.get(environment.serverUrl + "/api/ocrTemplateProperties/getAll");
  }

  getAllByTemplateId(templateId: any) {
    return this.httpClient.get(
      environment.serverUrl + "/api/ocrTemplateProperties/getAllPropertiesByTemplateId?templateId=" + templateId
    );
  }

  save(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/ocrTemplateProperties/save", body);
  }

  update(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/ocrTemplateProperties/update", body);
  }

  deleteTemplate(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/ocrTemplateProperties/deleteAllByTmpId", body);
  }

  deleteTemplateProperty(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/ocrTemplateProperties/delete", body);
  }
}

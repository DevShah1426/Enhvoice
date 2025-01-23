import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ImageEditorService {
  constructor(private httpClient: HttpClient) {}

  saveTemplate(body: any, utilityId: any, octType: any, uiFieldsJosn: any, providerId: any, propertyId: any) {
    let data = {
      octTempateJson: JSON.stringify(body),
      activeFlag: "Y",
      utilityId: utilityId,
      octType: octType,
      uiFieldsJosn: JSON.stringify(uiFieldsJosn),
      providerId: providerId,
      propertyId: propertyId,
    };
    return this.httpClient.post(environment.serverUrl + "/api/ocrTemplate/save", data);
  }

  getImagesFromPdf(fileObj: any) {
    const formData = new FormData();
    formData.append("pdf_file", fileObj);
    return this.httpClient.post(environment.ocrServerUrl + "/pdf_to_image/", formData);
  }
}

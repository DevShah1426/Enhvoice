import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TransactionsService {
  constructor(private httpClient: HttpClient) {}

  getAllDocs() {
    return this.httpClient.get(environment.serverUrl + "/api/trndocuments/getAll");
  }

  getAllTemplates() {
    return this.httpClient.get(environment.serverUrl + "/api/ocrTemplate/getAll");
  }

  getAllTemplatesV1() {
    return this.httpClient.get(environment.serverUrl + "/api/ocrTemplate/getAllV1");
  }

  getTemplateByPropertyId(propertyId: any) {
    return this.httpClient.get(environment.serverUrl + "/api/ocrTemplate/getAllV2?propertyId=" + propertyId);
  }

  getTemplatesByFilter(propertyId: any, utilityId: any, providerId: any) {
    return this.httpClient.get(
      environment.serverUrl +
        "/api/ocrTemplate/getAllByPropertyIdAndUtilityIdAndProviderId?propertyId=" +
        propertyId +
        "&utilityId=" +
        utilityId +
        "&providerId=" +
        providerId
    );
  }

  getDataByTransactionId(templateId: any) {
    return this.httpClient.get(environment.serverUrl + "/api/trndocuments/getById?id=" + templateId);
  }

  getUIFieldsByTemplateId(templateId: any) {
    return this.httpClient.get(environment.serverUrl + "/api/ocrTemplate/getById?id=" + templateId);
  }

  uploadFiles(templateId: any, images: any, epochTime: any, dateString: any) {
    const formData = new FormData();
    formData.append(
      "ocrRequestString",
      JSON.stringify({ template_id: templateId, userId: localStorage.getItem("usrId") })
    );
    formData.append("batchId", epochTime.toString());
    formData.append("batchIdString", dateString);
    for (let image of images) {
      formData.append("fileObj", image);
    }
    return this.httpClient.post(environment.serverUrl + "/api/ocrIntegration/ocrDocV1", formData);
  }

  downloadDocFile(filePath: any) {
    return this.httpClient.get(
      environment.serverUrl + "/api/trndocuments/downloadDocFile?documentPath=" + decodeURIComponent(filePath),
      {
        responseType: "arraybuffer" as "json",
      }
    );
  }

  verifyDoc(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/trndocuments/verifyDocumentV1", body);
  }

  reprocess(id: any) {
    return this.httpClient.get(environment.serverUrl + "/api/ocrIntegration/ocrReprocessV1?id=" + id);
  }

  getReportDetails(body: any) {
    return this.httpClient.get(environment.serverUrl + "/api/trndocuments/getAll?" + body);
  }

  getPropertyByAccountNo(body: any, templateId: any, transactionId: any) {
    return this.httpClient.get(
      environment.serverUrl +
        "/api/property/getPropertyByAccountNo?accountNo=" +
        body +
        "&templateId=" +
        templateId +
        "&id=" +
        transactionId
    );
  }

  getBatchWiseTransactions(filterBody: any) {
    let params = new HttpParams();
    for (const key in filterBody) {
      if (filterBody.hasOwnProperty(key)) {
        params = params.set(key, filterBody[key]);
      }
    }
    return this.httpClient.get(environment.serverUrl + "/api/trndocuments/getAllBatcheWiseV1?" + params);
  }

  getPropertyWiseTransactions(filterBody: any) {
    let params = new HttpParams();
    for (const key in filterBody) {
      if (filterBody.hasOwnProperty(key)) {
        params = params.set(key, filterBody[key]);
      }
    }
    return this.httpClient.get(environment.serverUrl + "/api/trndocuments/getAllPropertyWiseV1?" + params);
  }

  filterReport(filterBody: any) {
    let params = new HttpParams();
    for (const key in filterBody) {
      if (filterBody.hasOwnProperty(key)) {
        params = params.set(key, filterBody[key]);
      }
    }
    return this.httpClient.get(environment.serverUrl + "/api/property/report?" + params);
  }

  requestChange(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/trndocuments/requestChange", body);
  }

  approveChange(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/trndocuments/approveChangeRequest", body);
  }

  rejectChange(body: any) {
    return this.httpClient.post(environment.serverUrl + "/api/trndocuments/denyChangeRequest", body);
  }
}

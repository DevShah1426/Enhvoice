import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuditLogsService {
  constructor(private httpClient: HttpClient) {}

  getAllAuditLogs() {
    return this.httpClient.get(environment.serverUrl + "/api/auditLog/getAll");
  }

  filterAuditLogs(userId: any, fromDate: any, toDate: any) {
    if (fromDate && toDate) {
      return this.httpClient.get(
        environment.serverUrl +
          "/api/auditLog/auditLogReport?userId=" +
          userId +
          "&fromDate=" +
          fromDate +
          "&toDate=" +
          toDate
      );
    } else if (!userId && fromDate && toDate) {
      return this.httpClient.get(
        environment.serverUrl + "/api/auditLog/auditLogReport?fromDate=" + fromDate + "&toDate=" + toDate
      );
    } else if (userId && !fromDate && !toDate) {
      return this.httpClient.get(environment.serverUrl + "/api/auditLog/auditLogReport?userId=" + userId);
    } else {
      return this.getAllAuditLogs();
    }
  }
}

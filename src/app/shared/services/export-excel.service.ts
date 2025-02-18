import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class ExportExcelService {
  constructor(private datePipe: DatePipe) {}

  downloadExcel(dataList: any, dataColumns: any, excelName: string = "report") {
    const ws: XLSX.WorkSheet = this.convertToExcel(dataList, dataColumns);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const filename = excelName + "_" + this.datePipe.transform(new Date(), "yyyy_MM_dd_hh_mm_ss") + ".xlsx";
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename);
  }

  private convertToExcel(data: any[], dataColumns: { field: string; header: string }[]): XLSX.WorkSheet {
    const headers = dataColumns.map((col) => col.header);
    const rows = data.map((row) => dataColumns.map((col) => row[col.field]));
    return XLSX.utils.aoa_to_sheet([headers, ...rows]);
  }
}

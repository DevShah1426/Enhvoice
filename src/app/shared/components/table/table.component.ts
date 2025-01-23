import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrl: "./table.component.css",
})
export class TableComponent {
  @Input() dataList: any[] = [];
  @Input() checkboxSelectionVisible: boolean = false;
  @Input() actionsVisible: boolean = false;
  @Input() dataColumns: any[] = [];
  @Input() svgIcons: any[] = [];
  @Input() actionPermissions: { [key: string]: boolean } = {};
  selectedRecords: any[] = [];
  @Output() recordSelected = new EventEmitter<any[]>();
  @Output() actionClick = new EventEmitter<any>();

  onSelectionChange(event: any) {
    this.recordSelected.emit(this.selectedRecords);
  }

  onActionClick(action: any, record: any) {
    this.actionClick.emit({ action: action, record: record });
  }
}

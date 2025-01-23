import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-search-input",
  templateUrl: "./search-input.component.html",
  styleUrl: "./search-input.component.css",
})
export class SearchInputComponent {
  @Input() searchText: string = "";
  @Input() placeholder: string = "Search";
  @Input() height: string = "h-11";
  @Output() searchTextChange: EventEmitter<any> = new EventEmitter<any>();

  onSearchTextChange(event: any) {
    this.searchTextChange.emit(event.target.value.trim());
  }
}

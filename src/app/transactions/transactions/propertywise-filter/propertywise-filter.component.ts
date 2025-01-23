import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "../../../shared/services/toast.service";
import { years } from "../../../shared/constants/years";
import { months } from "../../../shared/constants/months";

@Component({
  selector: "app-propertywise-filter",
  templateUrl: "./propertywise-filter.component.html",
  styleUrl: "./propertywise-filter.component.css",
})
export class PropertywiseFilterComponent implements OnInit {
  years: any[] = years;
  selectedYear: any = null;

  months: any[] = months;
  selectedMonth: any = null;

  filterForm: FormGroup | any;
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      year: new FormControl("", [Validators.required]),
      month: new FormControl(""),
    });
    // set default year
    this.filterForm.get("year").setValue(this.years[0].value);
    this.selectedYear = this.years[0];
    let previousFilter = localStorage.getItem("filter");
    if (previousFilter) {
      // patch form with previous filter
      let year = JSON.parse(previousFilter).year;
      let month = JSON.parse(previousFilter).month;

      // iterate on year and return index of selected year
      let yearIndex = this.years.findIndex((y) => y.value == year);
      this.onYearSelect(this.years[yearIndex]);

      if (month) {
        let monthIndex = this.months.findIndex((m) => m.value == month);
        this.onMonthSelect(this.months[monthIndex]);
      }
    }
  }

  onYearSelect(event: any) {
    this.selectedYear = event;
    this.filterForm.get("year").setValue(event.value);
    this.filterForm.patchValue({
      month: "",
    });
    this.selectedMonth = null;
  }

  onMonthSelect(event: any) {
    // check if selected year is not null
    if (this.selectedYear == null) {
      this.toastService.showWarning("Please select year first.", "Warning");
      return;
    }
    this.selectedMonth = event;
    this.filterForm.get("month").setValue(event.value);
  }

  applyFilter() {
    this.onFilter.emit({
      year: this.filterForm.value.year,
      month: this.filterForm.value.month,
    });
  }

  resetFilter() {
    this.filterForm.get("year").setValue(this.years[0].value);
    this.filterForm.get("month").setValue("");
    localStorage.removeItem("filter");
    this.selectedMonth = null;
    this.onFilter.emit({
      year: this.filterForm.value.year,
      month: this.filterForm.value.month,
    });
  }
}

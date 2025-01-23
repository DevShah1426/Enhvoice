import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "../../../shared/services/toast.service";
import { years } from "../../../shared/constants/years";
import { months } from "../../../shared/constants/months";
import { days } from "../../../shared/constants/days";
import { UsersService } from "../../../masters/users/users.service";

@Component({
  selector: "app-batchwise-filter",
  templateUrl: "./batchwise-filter.component.html",
  styleUrl: "./batchwise-filter.component.css",
})
export class BatchwiseFilterComponent implements OnInit {
  years: any[] = years;
  selectedYear: any = null;

  months: any[] = months;
  selectedMonth: any = null;

  days: any[] = days;
  selectedDay: any = null;

  users: any[] = [];
  selectedUser: any = null;

  filterForm: FormGroup | any;
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();

  ugpId = localStorage.getItem("ugpId");

  constructor(private toastService: ToastService, private usersService: UsersService) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      year: new FormControl("", [Validators.required]),
      month: new FormControl(""),
      day: new FormControl(""),
      userId: new FormControl(""),
    });
    // set default year
    this.filterForm.get("year").setValue(this.years[0].value);
    this.selectedYear = this.years[0];
    this.getAllUsers();
  }

  getAllUsers() {
    this.usersService.getAllUsers().subscribe((res: any) => {
      let data = res.userDao;
      for (let i = 0; i < data.length; i++) {
        data[i].fullName = data[i].firstName + " " + data[i].lastName;
      }
      let ugpId = localStorage.getItem("ugpId");
      if (ugpId) {
        // add All Users option in dropdown at first position
        data.unshift({ id: 0, fullName: "All Users" });
      }
      this.users = data;
      let previousFilter = localStorage.getItem("filter");
      if (previousFilter) {
        // patch form with previous filter
        let year = JSON.parse(previousFilter).year;
        let month = JSON.parse(previousFilter).month;
        let day = JSON.parse(previousFilter).day;
        let userId = JSON.parse(previousFilter).userId;

        // iterate on year and return index of selected year
        let yearIndex = this.years.findIndex((y) => y.value == year);
        this.onYearSelect(this.years[yearIndex]);

        if (month) {
          let monthIndex = this.months.findIndex((m) => m.value == month);
          this.onMonthSelect(this.months[monthIndex]);
        }

        if (day) {
          let dayIndex = this.days.findIndex((d) => d.value == day);
          this.onDaySelect(this.days[dayIndex]);
        }

        if (userId >= 0) {
          let userIndex = this.users.findIndex((u) => u.id == userId);
          this.onUserSelect(this.users[userIndex]);
        }
      }
    });
  }

  onUserSelect(event: any) {
    this.selectedUser = event;
    this.filterForm.get("userId").setValue(event.id);
  }

  onYearSelect(event: any) {
    this.selectedYear = event;
    this.filterForm.get("year").setValue(event.value);
    this.filterForm.patchValue({
      month: "",
      day: "",
    });
    this.selectedMonth = null;
    this.selectedDay = null;
  }

  onMonthSelect(event: any) {
    // check if selected year is not null
    if (this.selectedYear == null) {
      this.toastService.showWarning("Please select year first.", "Warning");
      return;
    }
    this.selectedMonth = event;
    this.filterForm.get("month").setValue(event.value);
    this.filterForm.patchValue({
      day: "",
    });
    this.selectedDay = null;
  }

  onDaySelect(event: any) {
    // check if selected year is not null and month is not null
    if (this.selectedYear == null || this.selectedMonth == null) {
      this.toastService.showWarning("Please select year and month first.", "Warning");
      return;
    }
    this.selectedDay = event;
    this.filterForm.get("day").setValue(event.value);
  }

  onSearch() {
    const { year, month, day } = this.filterForm.value;
    if (year && month && day) {
      if (this.isValidDate(year, month, day)) {
        // alert("Date is valid!");
        this.applyFilter();
      } else {
        // alert("Invalid date!");
        this.toastService.showWarning("Invalid date!", "Warning");
      }
    } else {
      this.applyFilter();
    }
  }

  applyFilter() {
    this.onFilter.emit({
      year: this.filterForm.value.year,
      month: this.filterForm.value.month,
      day: this.filterForm.value.day,
      userId: this.filterForm.value.userId,
    });
  }

  // Check if the selected date is valid
  isValidDate(year: number, month: string, day: string): boolean {
    const date = new Date(year, parseInt(month) - 1, parseInt(day));
    return date.getFullYear() === +year && date.getMonth() + 1 === +month && date.getDate() === +day;
  }

  resetFilter() {
    this.filterForm.get("year").setValue(this.years[0].value);
    this.filterForm.get("month").setValue("");
    this.filterForm.get("day").setValue("");
    this.filterForm.get("userId").setValue("");
    this.selectedMonth = null;
    this.selectedDay = null;
    this.selectedUser = null;
    localStorage.removeItem("filter");
    this.onFilter.emit({
      year: this.filterForm.value.year,
      month: this.filterForm.value.month,
      day: this.filterForm.value.day,
      userId: this.filterForm.value.userId,
    });
  }
}

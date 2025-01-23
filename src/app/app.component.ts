import { AfterViewChecked, ChangeDetectorRef, Component } from "@angular/core";
import { LoadingService } from "./shared/services/loading.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements AfterViewChecked {
  title = "enhancor-ocr";
  isLoading$ = this.loadingService.isLoading$;

  constructor(
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngAfterViewChecked() {
    this.cdr.detectChanges(); // Manually trigger change detection after the view is checked
  }
}

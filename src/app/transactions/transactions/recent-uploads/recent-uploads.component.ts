import { Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
  selector: "app-recent-uploads",
  templateUrl: "./recent-uploads.component.html",
  styleUrl: "./recent-uploads.component.css",
})
export class RecentUploadsComponent {
  @Input() recentUploads: any[] = [];
  @ViewChild("bottom") bottom!: ElementRef;

  fileColors: any[] = ["#0475DD", "#DF9300"];
  displayCount = 3;

  loadMore(): void {
    this.displayCount += 3;
    setTimeout(() => {
      this.scrollToBottom();
    }, 10);
  }

  loadLess(): void {
    this.displayCount -= 3;
  }

  scrollToBottom(): void {
    try {
      this.bottom.nativeElement.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error scrolling to bottom:", err);
    }
  }
}

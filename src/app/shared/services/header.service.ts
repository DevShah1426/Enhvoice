import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HeaderService {
  private headerSubject = new BehaviorSubject<any>(null);
  public headerTitle$ = this.headerSubject.asObservable();

  updateHeader(title: any) {
    this.headerSubject.next(title);
  }
}

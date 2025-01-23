import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service (or local storage)
    const authToken = localStorage.getItem("authToken");

    // Clone the request and add the new header
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${authToken}` },
    });

    // Pass the cloned request instead of the original request to the next handle
    return next.handle(authReq);
  }
}

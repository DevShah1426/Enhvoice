import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { Router } from "@angular/router"; // Import Router
import { ERROR_CODES, ERROR_MESSAGES } from "../constants/messages.constant";
import { ToastService } from "../services/toast.service";
import { LoadingService } from "../services/loading.service"; // Adjust the path as needed
import { LoginService } from "../../login/login/login.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private errorMessages = {
    [ERROR_CODES.BAD_REQUEST]: ERROR_MESSAGES.BAD_REQUEST,
    [ERROR_CODES.UNAUTHORIZED]: ERROR_MESSAGES.UNAUTHORIZED,
    [ERROR_CODES.FORBIDDEN]: ERROR_MESSAGES.FORBIDDEN,
    [ERROR_CODES.NOT_FOUND]: ERROR_MESSAGES.NOT_FOUND,
    [ERROR_CODES.METHOD_NOT_ALLOWED]: ERROR_MESSAGES.METHOD_NOT_ALLOWED,
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    [ERROR_CODES.BAD_GATEWAY]: ERROR_MESSAGES.BAD_GATEWAY,
    [ERROR_CODES.SERVICE_UNAVAILABLE]: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
    [ERROR_CODES.GATEWAY_TIMEOUT]: ERROR_MESSAGES.GATEWAY_TIMEOUT,
    // Add other error codes and messages as needed
  };

  constructor(
    private toastService: ToastService,
    private loadingService: LoadingService,
    private router: Router,
    private loginService: LoginService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.show(); // Show the loader before the request is handled

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "";

        if (error.error instanceof ErrorEvent) {
          // Client-side error or network error
          errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
        } else {
          // Server-side error
          const mappedErrorMessage = this.errorMessages[error.status];
          if (mappedErrorMessage) {
            errorMessage = mappedErrorMessage;
          }

          // Check for unauthorized error to redirect to login
          if (error.status === ERROR_CODES.UNAUTHORIZED) {
            this.loginService.logout();
            alert(ERROR_MESSAGES.UNAUTHORIZED);
            window.location.reload();
          }
        }

        // Display the error message using ToastService
        this.toastService.showError(errorMessage);

        return throwError(errorMessage);
      }),
      finalize(() => {
        this.loadingService.hide(); // Hide the loader after the request completes or errors out
      })
    );
  }
}

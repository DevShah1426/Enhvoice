export class AlertDetails {
  showOkButton?: boolean = true;
  okButtonLabel?: string = "Ok";
  showCancelButton?: boolean = false;
  cancelButtonLabel?: string = "Cancel";
  title?: string = "";
  message?: string = "";
  showSuccessIcon?: boolean = false;
  showWarningIcon?: boolean = false;
  showErrorIcon?: boolean = false;
  showInfoIcon?: boolean = false;
  showCloseButton?: boolean = true;
  details?: any = null;
  description?: string = "";
  routerLink?: string = "";
}

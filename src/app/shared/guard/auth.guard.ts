import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "../../login/login/login.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.loginService.isAuthenticated()) {
      this.router.navigate([""]);
      return false;
    }
    return true;
  }

  constructor(private router: Router, private loginService: LoginService) {}
}

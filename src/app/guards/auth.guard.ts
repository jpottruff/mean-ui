import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

// https://stackoverflow.com/questions/75564717/angular-canactivate-is-deprecated-how-to-replace-it
export const AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuthorized = authService.getIsAuthorized();
        
    if (!isAuthorized) {
        router.navigate(['/auth/login'])
    }

    return isAuthorized;
};
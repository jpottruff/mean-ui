import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Injectable, inject } from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const isAuthorized = this.authService.getIsAuthorized();
        
        if (!isAuthorized) {
            this.router.navigate(['/auth/login'])
        }

        return isAuthorized;
    }
}

// TODO - implement this to avoid deprecated CanActivate
// https://stackoverflow.com/questions/75564717/angular-canactivate-is-deprecated-how-to-replace-it
// export const AuthGuard: CanActivateFn = (
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ) => {
//     const authService = inject(AuthService);
//     const router = inject(Router);

//     const isAuthorized = authService.getIsAuthorized();
        
//     if (!isAuthorized) {
//         router.navigate(['/login'])
//     }

//     return isAuthorized;
// };
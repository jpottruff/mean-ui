import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, catchError, throwError } from "rxjs";
import { ErrorComponent } from "../components/error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private readonly dialog: MatDialog) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                console.log(err);
                let errMsg = 'An unknown error occurred.'
                if (err.error.message) {
                    errMsg = err.error.message
                }

                this.dialog.open(ErrorComponent, {
                    data: { message: errMsg }
                })
                // alert(err.error.message)
                // RE: throw error deprecated: https://stackoverflow.com/questions/68655492/throwerrorerror-is-now-deprecated-but-there-is-no-new-errorhttperrorresponse
                return throwError(() => err)
            })
        )
    }
}
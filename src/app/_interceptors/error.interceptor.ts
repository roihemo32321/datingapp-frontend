import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }
                console.log(modelStateErrors.flat());

                throw modelStateErrors.flat();
              } else {
                console.log(error.error, error.status);
                break;
              }

            case 401:
              console.log('Unauthorize');
              break;

            case 404:
              this.router.navigateByUrl('/not-found');
              break;

            case 500:
              // Setting a router state and adding it to the navigateByUrl.
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              console.log(navigationExtras);

              this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              console.log(error);
              break;
          }
        }

        console.log(error);

        throw error;
      })
    );
  }
}

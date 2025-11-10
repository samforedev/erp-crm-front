import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ApiErrorResponse, ApiSuccessResponse} from "../models/apiResponse";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === 4 && event.body) {
          const responseBody = event.body as ApiSuccessResponse<any> | ApiErrorResponse<any>;
          if (responseBody.hasOwnProperty('isSuccess') && !responseBody.isSuccess) {
            throw responseBody as ApiErrorResponse<any>;
          }
        }
        return event;
      }),
      catchError((error) => {
        if (error.isSuccess === false) {
          const apiError = error as ApiErrorResponse<any>;
          return throwError(() => apiError);
        }
        if (error instanceof ErrorEvent) {
          return throwError(() => new Error('Un error de red o cliente ocurrió.'));
        }
        if (error instanceof HttpErrorResponse) {
          console.error(`Error HTTP de bajo nivel ${error.status}: ${error.message}`);
        }
        return throwError(() => error);
      })
    );
  }
}

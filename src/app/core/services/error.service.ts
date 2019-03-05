import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: Error | HttpErrorResponse): void {
    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        this.snackBar.open(error.message, 'Offline Error!');
      } else {
        const errorCode = error.status;
        const errorType = this.resolveErrorCode(errorCode);
        const specificErrors = this.getSpecificErrors(error.error);
        const errorMessage =
          specificErrors !== '' ? specificErrors : error.message;

        this.snackBar.open(errorMessage, `${errorCode} : ${errorType}!`, {
          duration: 3000
        });
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      this.snackBar.open(error.message, 'Error!', { duration: 3000 });
    }

    console.log(error);
  }

  private getSpecificErrors(error): string {
    return error.message ? error.message : '';
  }

  private resolveErrorCode(code: number): string {
    switch (code) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 500:
        return 'Server Error';
      case 502:
        return 'Bad Gateway';
      case 503:
        return 'Service Unavailable';
      case 504:
        return 'Gateway Timeout';
    }
  }
}

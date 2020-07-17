import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorprocessorService {

  constructor() { }

  public handleError(error: HttpErrorResponse | any) {
    let errMsg = '';

    if (error instanceof ErrorEvent) {
      errMsg = error.error.message;
    } else {
      errMsg = `${error.status} : ${error.statusText || ' '} -- ${error.message}`;
    }

    return throwError(errMsg);
  }
}

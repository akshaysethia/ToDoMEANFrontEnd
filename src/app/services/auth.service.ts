import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorprocessorService } from './errorprocessor.service';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../shared/users';
import { baseURL } from '../shared/baseurl';

interface LogUser {
  success: boolean;
  message: string;
  token: string;
  user: {
    name: string;
    username: string;
    email: string;
  };
}

interface Profile {
  user: {
    username: string;
    email: string;
    name: string;
  }
}

interface JWTResponse {
  success: boolean;
  message: string;
  user: any;
}

interface Register {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  tokenKey = 'JWT';
  isAuthenticated: Boolean = false;
  username: Subject<string> = new Subject<string>();
  authToken: string = undefined;

  constructor(private http: HttpClient, private errorProcessor: ErrorprocessorService) { }

  loadUserCredentials() {
    const credentials = JSON.parse(localStorage.getItem(this.tokenKey));
    if (credentials && credentials.username !== undefined) {
      this.useCredentials(credentials);
      if (this.authToken) {
        this.checkJWTtoken();
      }
    }
  }

  checkJWTtoken() {
    this.http.get<JWTResponse>(baseURL + '/auth/checkToken')
      .subscribe(res => {
        this.sendUsername(res.user.username);
      }, err => {
        this.destroyUserCedentials();
      });
  }

  storeUserCredentials(credentials: any) {
    localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    this.useCredentials(credentials);
  }

  useCredentials(credentials: any) {
    this.isAuthenticated = true;
    this.sendUsername(credentials.username);
    this.authToken = credentials.token;
  }

  sendUsername(name: string) {
    this.username.next(name);
  }

  loginUser(user: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<LogUser>(baseURL + '/auth/login', user, httpOptions)
      .pipe(map(res => {
        if (res.success) {
          this.storeUserCredentials({ username: res.user.username, token: res.token });
          return { 'success': res.success, 'username': res.user.username };
        } else {
          return { 'success': res.success, 'message': res.message };
        }
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  signup(user: User): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Register>(baseURL + '/auth/register', user, httpOptions)
      .pipe(map(res => {
        return { 'success': res.success, 'message': res.message };
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  getProfile(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<Profile>(baseURL + '/auth/profile')
      .pipe(map(res => {
        if (res.user) {
          return { 'username': res.user.username, 'email': res.user.email, 'name': res.user.name };
        }
      }))
      .pipe(catchError(this.errorProcessor.handleError));
  }

  destroyUserCedentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
  }

  clearUsername() {
    this.username.next(undefined);
  }

  logOut() {
    this.destroyUserCedentials();
  }

  isLoggedIn(): Boolean {
    return this.isAuthenticated;
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  getToken(): string {
    return this.authToken;
  }
}
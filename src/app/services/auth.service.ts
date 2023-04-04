import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthData } from '../models/auth-data.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token: string;
  get token(): string { return this._token; };
  set token(token: string) { this._token = token; };
  private tokenTimer: any // NodeJS.Timer;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private userId: string;


  get SERVER_BASE() {
    return `http://localhost:3000`
  } 

  constructor(private readonly http: HttpClient, private readonly router: Router) { }

  getIsAuthorized() {
    return this.isAuthenticated;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getUserId(): string {
    return this.userId;
  }

  createUser(email: string, password: string) { 
    const authData: AuthData = { email, password }; 
    this.http.post<{}>(`${this.SERVER_BASE}/api/user/signup`, authData)
    .subscribe(res => {
      // TODO - login logic
      console.log('res', res)
    })
  }
  
  login(email: string, password: string): void {
    const authData: AuthData = { email, password }; 
    this.http.post<{message: string, token: string, expiresIn: number, userId: string }>(`${this.SERVER_BASE}/api/user/login`, authData)
    .subscribe(res => {
        this.token = res.token;
        if (this.token) {
          this.userId = res.userId;

          // sec to MS
          const expiresInMS = res.expiresIn * 1000;          
          this.setAuthTimer(expiresInMS);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInMS);
          this.saveAuthData(this.token, expirationDate, this.userId);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      })
  }

  logout(): void {
    this.userId = null;
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  autoAuthenticateUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return; 
    }

    const now = new Date();
    // this is already in MS
    const expiresInMS = authInfo.expirationDate.getTime() - now.getTime();

    if (expiresInMS > 0) {
      this.token = authInfo.token;
      this.setAuthTimer(expiresInMS)
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.userId = authInfo.userId;
    }
  }
  
  /** @param ms - the number of **milliseconds** to set the timer for */
  private setAuthTimer(ms: number): void {
    this.tokenTimer = setTimeout(() => this.logout(), ms);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private getAuthData(): { token: string, expirationDate: Date, userId: string } {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }

    return {token, expirationDate: new Date(expirationDate), userId };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}

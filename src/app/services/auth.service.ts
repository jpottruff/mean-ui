import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token: string;
  get token(): string { return this._token; }
  set token(token: string) { this._token = token; }

  get SERVER_BASE() {
    return `http://localhost:3000`
  } 

  constructor(private readonly http: HttpClient) { }

  createUser(email: string, password: string) { 
    const authData: AuthData = { email, password }; 
    this.http.post<{}>(`${this.SERVER_BASE}/api/user/signup`, authData)
    .subscribe(res => {
      console.log('res', res)
    })
  }
  
  login(email: string, password: string) {
    const authData: AuthData = { email, password }; 
    this.http.post<{message: string, token: string}>(`${this.SERVER_BASE}/api/user/login`, authData)
    .subscribe(res => {
        this.token = res.token;
      })
  }
}

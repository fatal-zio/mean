import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../../shared/models/auth-data';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/api/users';
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private http: HttpClient) {}

  getToken(): string {
    return localStorage.getItem('token');
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser(): void {
    const localAuthData = this.getLocalAuthData();

    if (!localAuthData) {
      return;
    }

    const now = new Date();
    if (localAuthData.expirationDate > now) {
      this.isAuthenticated = true;
      this.setTokenTimer(
        (localAuthData.expirationDate.getTime() - now.getTime()) / 1000
      );
      this.authStatusListener.next(true);
    }
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post(this.url + '/signup', authData).subscribe(response => {});
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number }>(this.url + '/login', authData)
      .subscribe(response => {
        if (response.token) {
          this.setTokenTimer(response.expiresIn);
          this.isAuthenticated = true;
          this.saveAuthData(response.token, response.expiresIn);
          this.authStatusListener.next(true);
        }
      });
  }

  logout(): void {
    this.isAuthenticated = false;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.authStatusListener.next(false);
  }

  private setTokenTimer(expireDurationInSeconds: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expireDurationInSeconds * 1000);
  }

  private saveAuthData(token: string, expireDurationInSeconds: number): void {
    const now = new Date();
    const expirationDate = new Date(
      now.getTime() + expireDurationInSeconds * 1000
    );

    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getLocalAuthData(): { token: string; expirationDate: Date } {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (token && expirationDate) {
      return {
        token,
        expirationDate: new Date(expirationDate)
      };
    }

    return;
  }
}

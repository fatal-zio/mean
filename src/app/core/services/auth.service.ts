import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../../shared/models/auth-data';
import { Subject, Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/api/users';
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getToken(): string {
    return localStorage.getItem('token');
  }

  getUserId(): string {
    return localStorage.getItem('userId');
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
    return this.http.post(this.url + '/signup', authData);
  }

  login(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        this.url + '/login',
        authData
      )
      .subscribe(
        response => {
          if (response.token) {
            this.setTokenTimer(response.expiresIn);
            this.isAuthenticated = true;
            this.saveAuthData(
              response.token,
              response.expiresIn,
              response.userId
            );
            this.authStatusListener.next(true);
          }
        },
        error => {
          this.errorService.handleError(error);
          this.authStatusListener.next(false);
        }
      );
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

  private saveAuthData(
    token: string,
    expireDurationInSeconds: number,
    userId: string
  ): void {
    const now = new Date();
    const expirationDate = new Date(
      now.getTime() + expireDurationInSeconds * 1000
    );

    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getLocalAuthData(): {
    token: string;
    expirationDate: Date;
    userId: string;
  } {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (token && expirationDate && userId) {
      return {
        token,
        expirationDate: new Date(expirationDate),
        userId
      };
    }

    return;
  }
}

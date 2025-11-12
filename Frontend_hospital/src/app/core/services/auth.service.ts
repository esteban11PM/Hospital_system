import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:6911/api/auth';
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.tokenKey, authResult.token);
    if (authResult.user) {
      localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): any {
    try {
      const user = localStorage.getItem(this.userKey);
      if (user && user !== 'undefined') {
        return JSON.parse(user);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.logout(); // Limpiar datos corruptos
      return null;
    }
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }
}
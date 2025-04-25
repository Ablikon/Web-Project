import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, User, RegisterRequest } from '../models/user.interface';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private http: HttpClient) {
    let storedUser = null;
    
    if (this.isBrowser) {
      try {
        storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      } catch (e) {
        storedUser = null;
      }
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/`, registerRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Registration error:', error);
        return throwError(() => error);
      }),
      // After registration, login the user
      switchMap(() => this.login({
        username: registerRequest.username,
        password: registerRequest.password
      }))
    );
  }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, loginRequest)
      .pipe(
        switchMap(tokenResponse => {
          // Django returns { token: 'your-token' }
          const token = tokenResponse.token;
          
          // Now get the user info using the token
          return this.http.get<User>(`${this.apiUrl}/users/profile/`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          }).pipe(
            map(user => {
              const response: LoginResponse = {
                token: token,
                user: user
              };
              
              if (this.isBrowser) {
                localStorage.setItem('token', token);
                localStorage.setItem('currentUser', JSON.stringify(user));
              }
              
              this.currentUserSubject.next(user);
              return response;
            })
          );
        })
      );
  }

  getUserProfile(): Observable<any> {
    return this.http.get<User>(`${this.apiUrl}/users/profile/`).pipe(
      tap(user => {
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Error getting user profile:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user !== null && user.role === 'admin';
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null && this.getToken() !== null;
  }
} 
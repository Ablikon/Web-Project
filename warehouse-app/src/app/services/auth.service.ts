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

  login(loginRequest: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login/`, loginRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        return throwError(() => error);
      }),
      tap(response => {
        if (this.isBrowser && response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      // Try to get user profile after login
      switchMap(() => this.getUserProfile().pipe(
        catchError(error => {
          console.error('Error getting user profile:', error);
          // If we can't get the user profile, still consider login successful
          // but return a default user object
          const defaultUser: User = {
            id: 0,
            username: loginRequest.username,
            email: '',
            first_name: '',
            last_name: '',
            role: 'storekeeper'
          };
          
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(defaultUser));
          }
          this.currentUserSubject.next(defaultUser);
          
          return of({ token: this.getToken() || '' });
        })
      ))
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
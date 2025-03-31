import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginRequest, LoginResponse, User, RegisterRequest } from '../models/user.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api';
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

  register(registerRequest: RegisterRequest): Observable<LoginResponse> {
    console.log('Registering user:', registerRequest);
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, registerRequest)
      .pipe(map(response => {
        console.log('Registration response:', response);
        if (this.isBrowser) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        this.currentUserSubject.next(response.user);
        return response;
      }));
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    console.log('Logging in user:', loginRequest.username);
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest)
      .pipe(map(response => {
        console.log('Login response:', response);
        if (this.isBrowser) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        this.currentUserSubject.next(response.user);
        return response;
      }));
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
} 
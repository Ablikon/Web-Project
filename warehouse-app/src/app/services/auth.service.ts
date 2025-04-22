import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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

  register(registerRequest: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<any>(`${this.apiUrl}/auth/register/`, registerRequest)
      .pipe(
        switchMap(response => {
          return this.login({
            username: registerRequest.username,
            password: registerRequest.password
          });
        })
      );
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(`${this.apiUrl}/login/`, loginRequest)
      .pipe(
        switchMap(tokenResponse => {
          const token = tokenResponse.token;
          
          return this.http.get<User>(`${this.apiUrl}/users/me/`, {
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

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(roles: string[]): boolean {
    const currentUser = this.getCurrentUser();
    if (currentUser && roles.includes(currentUser.role)) {
      return true;
    }
    return false;
  }

  isAdmin(): boolean {
    return this.hasRole(['admin']);
  }

  isManager(): boolean {
    return this.hasRole(['admin', 'manager']);
  }

  isStorekeeper(): boolean {
    return this.hasRole(['admin', 'manager', 'storekeeper']);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}/`);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}/`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}/`);
  }
} 
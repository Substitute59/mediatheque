import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { jwtDecode } from 'jwt-decode';
import { UserDTO } from '../user/user.model';

interface LoginResponse {
  token: string;
  refreshToken: string;
}

interface RegisterResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiPath}/api/auth`;
  private currentUserSubject = new BehaviorSubject<UserDTO | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      this.currentUserSubject.next(this.decodeToken(parsed.token));
    }
  }

  private decodeToken(token: string): UserDTO {
    const decoded: any = jwtDecode(token);
    return {
      username: decoded.sub,
      id: decoded.id,
      role: decoded.role,
      avatar: decoded.avatar,
      token
    } as UserDTO;
  }

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue(): UserDTO | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUserSubject.value?.token || null;
  }

  get refreshToken(): string | null {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved).refreshToken : null;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('user', JSON.stringify(res));
        this.currentUserSubject.next(this.decodeToken(res.token));
      })
    );
  }

  register(user: FormData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, user);
  }

  refreshTokenRequest(): Observable<{ token: string }> {
    const refreshToken = this.refreshToken;
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(res => {
        const saved = JSON.parse(localStorage.getItem('user')!);
        saved.token = res.token;
        localStorage.setItem('user', JSON.stringify(saved));
        this.currentUserSubject.next(this.decodeToken(res.token));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, password });
  }
}

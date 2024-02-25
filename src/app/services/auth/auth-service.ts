/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

const AUTH_API =
  'https://app.microenv.com/backend/key/1b40b895e89f87f922b2b3/rest/api/auth/';

interface LoginResponse {
  status: number;
  message: string;
  result: {
    token: string;
    userId: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('userId');
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${AUTH_API}login`, { email, password })
      .pipe(
        tap(res => {
          if (res.result) {
            localStorage.setItem('userId', res.result.userId);
          } else {
            alert('Failed');
          }
        })
      );
  }
}

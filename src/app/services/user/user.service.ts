import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GetUserResponse {
  status: number;
  message: number;
  result: User[];
}

export interface User {
  status: number;
  message: number;
  result: User;
}

export interface User {
  userId: number;
  email: string;
  fullName: string;
  phone: string;
  mobile: string;
  websiteUrl: string;
  gitHubUrl: string;
  linkedinUrl: string;
  address: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl =
    'https://app.microenv.com/backend/key/5b44f5b2d92346ed2eb405/rest/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<GetUserResponse> {
    return this.http.get<GetUserResponse>(this.apiUrl);
  }

  getUserById(): Observable<User> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.log('Error fetching user');
    }

    const url = `${this.apiUrl}/${userId}`;

    return this.http.get<User>(url);
  }
}

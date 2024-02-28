import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetUserResponse, IResponse, IUser } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl =
    'https://app.microenv.com/backend/key/c24220b2cd4cbf293c2b15/rest/api/users';
  private allUsersSubject: BehaviorSubject<IUser[]> = new BehaviorSubject<
    IUser[]
  >([]);

  public allUsers$: Observable<IUser[]> = this.allUsersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchAllUsers();
  }

  private fetchAllUsers(): void {
    this.http
      .get<GetUserResponse>(this.apiUrl)
      .pipe(
        tap((response: GetUserResponse) => {
          if (response && response.result) {
            this.allUsersSubject.next(response.result);
          } else {
            console.error('Error fetching users:', response);
          }
        })
      )
      .subscribe();
  }

  getUserById(): Observable<IResponse<IUser>> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.log('Error fetching user');
    }

    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<IResponse<IUser>>(url);
  }
}

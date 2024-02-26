import { Component, OnInit } from '@angular/core';
import { IUser, UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: IUser | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserById().subscribe(
      data => {
        this.user = data.result;
      },
      error => {
        console.log('Error fetching user:', error);
      }
    );
  }
}

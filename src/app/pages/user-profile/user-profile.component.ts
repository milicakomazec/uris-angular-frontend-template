import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: User | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserById().subscribe(
      data => {
        this.user = data.result;
        console.log('user', this.user);
      },
      error => {
        console.log('Error fetching user:', error);
      }
    );
  }
}

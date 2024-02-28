import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITask, IUser } from '../../shared/interfaces';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth-service';
import { TaskService } from '../../services/task/task.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class UserProfileComponent implements OnInit {
  user: IUser | undefined;
  tasks!: ITask[];
  userTasks!: ITask[];
  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.getUserById().subscribe({
      next: data => {
        this.user = data.result;
      },
      error: error => {
        console.log('Error fetching user:', error);
      },
    });

    this.taskService.getAllTasks().subscribe({
      next: data => {
        this.tasks = data.result;
        this.loadUserTasks();
      },
      error: error => {
        console.log('Error fetching user tasks:', error);
      },
    });
  }

  loadUserTasks(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userTasks = this.tasks.filter(
        task => task.assignedUserId === Number(userId)
      );
    }
  }
}

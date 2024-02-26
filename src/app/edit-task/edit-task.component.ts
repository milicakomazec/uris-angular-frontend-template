import { Component, OnInit } from '@angular/core';
import {
  ITask,
  TaskPriority,
  TaskService,
  TaskStatus,
  TaskType,
} from '../services/task/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IUser, UserService } from '../services/user/user.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent implements OnInit {
  taskId!: number;
  task!: ITask;
  isLoading: boolean = true;
  taskType = TaskType;
  taskStatus = TaskStatus;
  taskPriority = TaskPriority;
  allUsers: IUser[] = [];
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['id'];
      this.getTaskById();
      this.userService.allUsers$.subscribe(users => {
        this.allUsers = users;
      });
    });
  }

  getTaskById(): void {
    this.taskService.getTaskById(this.taskId).subscribe(
      response => {
        if (response) {
          this.task = response;
          this.isLoading = false;
          console.log('Fetched data');
        } else {
          console.error('Failed to fetch task');
        }
      },
      error => {
        console.error('Error fetching task:', error);
      }
    );
  }

  onSubmit(): void {
    this.taskService.editTask(this.taskId, this.task).subscribe(
      response => {
        console.log('Task updated successfully:', response);
        this.task = response;
      },
      error => {
        console.error('Error updating task:', error);
      }
    );
    this.router.navigate(['/backlog'], {
      queryParams: { page: 1 },
    });
  }

  onReset(): void {
    this.getTaskById();
  }
}

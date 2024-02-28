import { Component, OnInit } from '@angular/core';
import {
  TaskPriority,
  TaskService,
  TaskStatus,
  TaskType,
} from '../services/task/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user/user.service';
import { ITask, IUser } from '../shared/interfaces';

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
    this.taskService.getTaskById(this.taskId).subscribe({
      next: response => {
        if (response) {
          this.task = response;
          this.isLoading = false;
        }
      },
      error: error => {
        console.error('Error fetching task:', error);
      },
    });
  }

  onSubmit(): void {
    this.taskService.editTask(this.taskId, this.task).subscribe({
      next: response => {
        console.log('Task updated successfully:', response);
        this.task = response;
      },
      error: error => {
        console.error('Error updating task:', error);
      },
      complete: () => {
        this.router.navigate(['/backlog'], {
          queryParams: { page: 1 },
        });
      },
    });
  }

  onReset(): void {
    this.getTaskById();
  }
  onCancel(): void {
    this.router.navigate(['/backlog'], {
      queryParams: { page: 1 },
    });
  }
}

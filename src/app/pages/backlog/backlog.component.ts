import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ITask,
  TaskPriority,
  TaskService,
  TaskStatus,
  TaskType,
} from '../../services/task/task.service';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-backlog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],

  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.scss',
})
export class BacklogComponent implements OnInit {
  taskForm!: FormGroup;
  task: ITask[] = [];
  taskStatus = TaskStatus;
  taskType = TaskType;
  taskPriority = TaskPriority;
  taskId: number | null = null;
  tasksPerPage = 7;
  totalPages = 0;
  currentPage = 1;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('OPEN', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (response: { result: ITask[] }) => {
        this.task = response.result;
        this.totalPages = Math.ceil(this.task.length / this.tasksPerPage);
        console.log('total psgeed', this.totalPages);
      },
    });
  }

  getCurrentPageTasks(): ITask[] {
    const startIndex = (this.currentPage - 1) * this.tasksPerPage;
    const endIndex = startIndex + this.tasksPerPage;
    return this.task.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.router.navigate(['/backlog'], {
        queryParams: { page: this.currentPage },
      });
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.router.navigate(['/backlog'], {
        queryParams: { page: this.currentPage },
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.router.navigate(['/backlog'], { queryParams: { page: page } });
    }
  }

  getBadgeClass(value: string): string {
    switch (value) {
      case 'epic':
        return 'badge badge-primary';
      case 'task':
        return 'badge badge-secondary';
      case 'bug':
        return 'badge badge-danger';
      case 'low':
        return 'badge badge-info';
      case 'medium':
        return 'badge badge-warning';
      case 'high':
        return 'badge badge-danger';
      case 'urgent':
        return 'badge badge-dark';
      default:
        return 'badge badge-light';
    }
  }
}

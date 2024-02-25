import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
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
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],

  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.scss',
})
export class BacklogComponent implements OnInit {
  taskForm!: FormGroup;
  task: ITask[] = [];
  filteredTasks: ITask[] = [];
  taskStatus = TaskStatus;
  taskType = TaskType;
  taskPriority = TaskPriority;
  taskId: number | null = null;
  tasksPerPage = 7;
  totalPages = 0;
  currentPage = 1;
  selectedType: string = 'all';
  selectedPriority: string = 'all';
  titleSortOrder: 'asc' | 'desc' = 'asc';
  typeSortOrder: 'asc' | 'desc' = 'asc';
  prioritySortOrder: 'asc' | 'desc' = 'asc';

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
        this.task = response.result.filter(task => task.status === 'new');
        this.totalPages = Math.ceil(this.task.length / this.tasksPerPage);
        this.applyFilters();
      },
    });
  }

  applyFilters() {
    this.filteredTasks = this.task.filter(task => {
      const typeFilter =
        !this.selectedType ||
        this.selectedType === 'all' ||
        task.type === this.selectedType;
      const priorityFilter =
        !this.selectedPriority ||
        this.selectedPriority === 'all' ||
        task.priority === this.selectedPriority;
      return typeFilter && priorityFilter;
    });
    this.totalPages = Math.ceil(this.filteredTasks.length / this.tasksPerPage);
  }

  getCurrentPageTasks(): ITask[] {
    const startIndex = (this.currentPage - 1) * this.tasksPerPage;
    const endIndex = startIndex + this.tasksPerPage;
    return this.filteredTasks.slice(startIndex, endIndex);
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

  sortData(column: string) {
    switch (column) {
      case 'title':
        this.titleSortOrder = this.toggleSortOrder(this.titleSortOrder);
        this.filteredTasks.sort((a, b) => {
          return this.sortByString(a.title, b.title, this.titleSortOrder);
        });
        break;
      case 'type':
        this.typeSortOrder = this.toggleSortOrder(this.typeSortOrder);
        this.filteredTasks.sort((a, b) => {
          return this.sortByString(a.type, b.type, this.typeSortOrder);
        });
        break;
      case 'priority':
        this.prioritySortOrder = this.toggleSortOrder(this.prioritySortOrder);
        this.filteredTasks.sort((a, b) => {
          return this.sortByString(
            a.priority,
            b.priority,
            this.prioritySortOrder
          );
        });
        break;
    }
  }

  toggleSortOrder(currentOrder: 'asc' | 'desc'): 'asc' | 'desc' {
    return currentOrder === 'asc' ? 'desc' : 'asc';
  }

  sortByString(a: string, b: string, sortOrder: 'asc' | 'desc'): number {
    if (sortOrder === 'asc') {
      return a.localeCompare(b);
    } else {
      return b.localeCompare(a);
    }
  }
}

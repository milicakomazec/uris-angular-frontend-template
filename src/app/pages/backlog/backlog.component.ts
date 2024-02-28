import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ITask,
  TaskPriority,
  TaskService,
  TaskStatus,
  TaskType,
} from '../../services/task/task.service';

import { Router, RouterModule } from '@angular/router';
import { IUser } from '../../shared/interfaces';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-backlog',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],

  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.scss',
})
export class BacklogComponent implements OnInit {
  taskForm!: FormGroup;
  tasks: ITask[] = [];
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
  taskToDeleteId: number | null = null;
  isModalVisible: boolean = false;
  newTask: ITask = {} as ITask;
  isFormModalVisible: boolean = false;
  allUsers: IUser[] = [];

  constructor(
    private taskService: TaskService,
    private userService: UserService,

    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllTasks();
    this.userService.allUsers$.subscribe(users => {
      this.allUsers = users;
    });
  }

  getAllTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (response: { result: ITask[] }) => {
        this.tasks = response.result.filter(task => task.status === 'new');
        this.totalPages = Math.ceil(this.tasks.length / this.tasksPerPage);
        this.applyFilters();
      },
    });
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
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
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredTasks.length / this.tasksPerPage);
    this.router.navigate(['/backlog'], {
      queryParams: { page: this.currentPage },
    });
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

  @ViewChild('deleteModal') deleteModal!: ElementRef;

  openModal(taskId: number) {
    this.isModalVisible = true;
    this.taskToDeleteId = taskId;
  }

  closeModal() {
    this.taskToDeleteId = null;
    this.isModalVisible = false;
  }

  deleteTask() {
    if (this.taskToDeleteId) {
      this.taskService.deleteTaskById(this.taskToDeleteId).subscribe({
        next: () => {
          // this.getAllTasks();
          const index = this.filteredTasks.findIndex(
            task => task.id === this.taskToDeleteId
          );
          if (index !== -1) {
            this.filteredTasks.splice(index, 1);
          }
          this.closeModal();
        },
        error: error => {
          console.error('Error deleting task:', error);
          this.closeModal();
        },
      });
    }
  }

  editTask(taskId: number) {
    this.router.navigate(['/task/', taskId]);
  }

  onSubmit(): void {
    this.taskService.addTask(this.newTask).subscribe({
      next: response => {
        console.log('Task created successfully:', response);
        this.tasks.unshift(response);
        this.filteredTasks = [...this.tasks];
        this.closeForm();
      },
      error: error => {
        console.error('Error creating task:', error);
      },
    });
  }

  onReset(): void {
    this.newTask = {} as ITask;
  }

  openForm(): void {
    this.isFormModalVisible = true;
  }

  closeForm(): void {
    this.isFormModalVisible = false;
    this.onReset();
  }
}

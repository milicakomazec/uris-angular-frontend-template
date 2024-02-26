/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ITask, TaskService } from '../../services/task/task.service';
import { IUser, UserService } from '../../services/user/user.service';
import { TaskTypeChartComponent } from '../../charts/task-type-chart/task-type-chart-component';
import { TaskPriorityChartComponent } from '../../charts/task-priority-chart/task-priority-chart.component';
import { TaskStatusChartComponent } from '../../charts/task-status-chart/task-status-chart.component';
import { CommonModule } from '@angular/common';
import { UserTaskDistributionChartComponent } from '../../charts/user-task-distribution-chart/user-task-distribution-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TaskTypeChartComponent,
    TaskPriorityChartComponent,
    TaskStatusChartComponent,
    CommonModule,
    UserTaskDistributionChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  taskTypeCounts: { type: string; count: number }[] = [];
  taskPriorityCounts: { priority: string; count: number }[] = [];
  taskStatusCounts: { status: string; count: number }[] = [];
  isLoading = true;
  allUsers$: Observable<IUser[]> = this.userService.allUsers$;
  tasks: ITask[] = [];
  selectedUserId: number | undefined;
  chartData: { labels: string[]; data: number[] } | undefined;

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.taskService.getAllTasks().subscribe(
      response => {
        this.tasks = response.result;
        this.taskTypeCounts = this.calculateCounts(this.tasks, 'type') as {
          type: string;
          count: number;
        }[];
        this.taskPriorityCounts = this.calculateCounts(
          this.tasks,
          'priority'
        ) as { priority: string; count: number }[];
        this.taskStatusCounts = this.calculateCounts(this.tasks, 'status') as {
          status: string;
          count: number;
        }[];

        this.isLoading = false;
      },
      error => {
        console.error('Error fetching tasks:', error);
        this.isLoading = false;
      }
    );

    this.allUsers$.subscribe(users => {
      if (users.length > 0) {
        this.selectedUserId = users[0].userId;
        this.generateChartData(this.selectedUserId);
      }
    });
  }

  calculateCounts(
    tasks: ITask[],
    prop: keyof ITask
  ): { [key: string]: string | number }[] {
    const counts: { [key: string]: number } = {};
    tasks.forEach(task => {
      const value = task[prop];
      counts[value] = (counts[value] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      [prop]: key,
      count: counts[key],
    }));
  }
  onSelectUser(event: any) {
    this.selectedUserId = Number(event.target.value);
    this.generateChartData(this.selectedUserId);
  }

  generateChartData(userId: number) {
    const userTasks = this.tasks.filter(task => task.assignedUserId === userId);

    const statusCounts: { [key: string]: number } = {};
    userTasks.forEach(task => {
      const status = task.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const labels = Object.keys(statusCounts);
    const data = labels.map(label => statusCounts[label]);

    this.chartData = { labels, data };
  }
}

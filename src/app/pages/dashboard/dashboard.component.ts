import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITask, IUser } from '../../shared/interfaces';
import { TaskService } from '../../services/task/task.service';
import { UserService } from '../../services/user/user.service';
import { TaskDistribution, TaskPriority, TaskStatus } from '../../shared/enums';
import { TaskTypeChartComponent } from '../../charts/task-type-chart/task-type-chart-component';
import { TaskStatusChartComponent } from '../../charts/task-status-chart/task-status-chart.component';
import { TaskPriorityChartComponent } from '../../charts/task-priority-chart/task-priority-chart.component';
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
  chartData!: { title: string; labels: string[]; data: number[] }[];
  totalLoggedTime = 0;
  totalUsers = 0;
  totalActiveUrgentTasks = 0;

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.taskService.getAllTasks().subscribe({
      next: response => {
        this.tasks = response.result;
        this.totalLoggedTime = this.tasks.reduce(
          (total, task) => total + task.loggedTime,
          0
        );
        this.totalActiveUrgentTasks = this.tasks.filter(
          task =>
            task.priority === TaskPriority.URGENT &&
            task.status !== TaskStatus.DONE
        ).length;
        this.taskTypeCounts = this.calculateCounts(
          this.tasks,
          TaskDistribution.TYPE
        ) as {
          type: string;
          count: number;
        }[];
        this.taskPriorityCounts = this.calculateCounts(
          this.tasks,
          TaskDistribution.PRIORITY
        ) as { priority: string; count: number }[];
        this.taskStatusCounts = this.calculateCounts(
          this.tasks,
          TaskDistribution.STATUS
        ) as {
          status: string;
          count: number;
        }[];

        this.isLoading = false;
      },
      error: error => {
        console.error('Error fetching tasks:', error);
        this.isLoading = false;
      },
    });

    this.allUsers$.subscribe(users => {
      if (users.length > 0) {
        this.selectedUserId = users[0].userId;
        this.generateChartData(this.selectedUserId);
        this.totalUsers = users.length;
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
  onSelectUser(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedUserId = Number(target.value);
    this.generateChartData(this.selectedUserId);
  }

  generateChartData(userId: number) {
    const userTasks = this.tasks.filter(task => task.assignedUserId === userId);

    const statusCounts: { [key: string]: number } = {};
    const typeCounts: { [key: string]: number } = {};

    userTasks.forEach(task => {
      // Count status
      const status = task.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      // Count type
      const type = task.type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const statusLabels = Object.keys(statusCounts);
    const statusData = statusLabels.map(label => statusCounts[label]);

    const typeLabels = Object.keys(typeCounts);
    const typeData = typeLabels.map(label => typeCounts[label]);

    this.chartData = [
      { title: 'Status', labels: statusLabels, data: statusData },
      { title: 'Type', labels: typeLabels, data: typeData },
    ];
  }
}

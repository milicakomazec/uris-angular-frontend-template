import { Component } from '@angular/core';
import { ITask, TaskService } from '../../services/task/task.service';
import { TaskTypeChartComponent } from '../../charts/task-type-chart/task-type-chart-component';
import { TaskPriorityChartComponent } from '../../charts/task-priority-chart/task-priority-chart.component';
import { TaskStatusChartComponent } from '../../charts/task-status-chart/task-status-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TaskTypeChartComponent,
    TaskPriorityChartComponent,
    TaskStatusChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  taskTypeCounts: { type: string; count: number }[] = [];
  taskPriorityCounts: { priority: string; count: number }[] = [];
  taskStatusCounts: { status: string; count: number }[] = [];
  isLoading: boolean = true;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getAllTasks().subscribe(
      response => {
        this.taskTypeCounts = this.calculateTaskTypeCounts(response.result);
        this.taskPriorityCounts = this.calculatePriorityCounts(response.result);
        this.taskStatusCounts = this.calculateStatusCounts(response.result);
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching tasks:', error);

        this.isLoading = false;
      }
    );
  }

  calculateTaskTypeCounts(tasks: ITask[]): { type: string; count: number }[] {
    const typeCounts: { [type: string]: number } = {};
    tasks.forEach(task => {
      const type = task.type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    return Object.keys(typeCounts).map(type => ({
      type,
      count: typeCounts[type],
    }));
  }

  calculatePriorityCounts(
    tasks: ITask[]
  ): { priority: string; count: number }[] {
    const counts: { [priority: string]: number } = {};
    tasks.forEach(task => {
      const priority = task.priority;
      counts[priority] = (counts[priority] || 0) + 1;
    });
    return Object.keys(counts).map(priority => ({
      priority,
      count: counts[priority],
    }));
  }

  calculateStatusCounts(tasks: ITask[]): { status: string; count: number }[] {
    const counts: { [status: string]: number } = {};
    tasks.forEach(task => {
      const status = task.status;
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.keys(counts).map(status => ({
      status,
      count: counts[status],
    }));
  }
}

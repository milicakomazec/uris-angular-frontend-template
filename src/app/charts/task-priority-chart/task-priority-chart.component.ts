import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-task-priority-chart',
  standalone: true,
  imports: [],
  templateUrl: './task-priority-chart.component.html',
  styleUrl: './task-priority-chart.component.scss',
})
export class TaskPriorityChartComponent {
  @Input() taskPriorityCounts: { priority: string; count: number }[] = [];
  public chart!: Chart;
  public chartData!: ChartData;
  public chartOptions!: ChartOptions;

  @ViewChild('priorityChartCanvas') chartCanvas!: ElementRef;

  ngOnChanges(): void {
    if (this.taskPriorityCounts.length > 0 && this.chartCanvas) {
      this.createChart();
    }
  }

  createChart() {
    Chart.register(...registerables);
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    console.log('ctx', ctx);
    this.chartData = {
      labels: this.taskPriorityCounts.map(data => data.priority),
      datasets: [
        {
          data: this.taskPriorityCounts.map(data => data.count),
          backgroundColor: ['#060047', '#B3005E', '#E90064', '#FF5F9E'],
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'PRIORITY DISTRIBUTION',
          font: {
            size: 20,
          },
        },
        legend: {
          position: 'bottom',
        },
      },
    };

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: this.chartData,
      options: this.chartOptions,
    });
  }
}

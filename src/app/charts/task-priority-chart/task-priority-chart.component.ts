import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-task-priority-chart',
  standalone: true,
  imports: [],
  templateUrl: './task-priority-chart.component.html',
  styleUrl: '../chart-styles.scss',
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

    this.chartData = {
      labels: this.taskPriorityCounts.map(data => data.priority),
      datasets: [
        {
          data: this.taskPriorityCounts.map(data => data.count),
          backgroundColor: ['#5F0F40', '#FB8B24', '#E36414', '#9A031E'],
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

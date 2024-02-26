import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-task-status-chart',
  standalone: true,
  imports: [],
  templateUrl: './task-status-chart.component.html',
  styleUrl: '../chart-styles.scss',
})
export class TaskStatusChartComponent {
  @Input() taskStatusCounts: { status: string; count: number }[] = [];
  public chart!: Chart;
  public chartData!: ChartData;
  public chartOptions!: ChartOptions;

  @ViewChild('statusChartCanvas') chartCanvas!: ElementRef;

  ngOnChanges(): void {
    if (this.taskStatusCounts.length > 0 && this.chartCanvas) {
      this.createChart();
    }
  }

  createChart() {
    Chart.register(...registerables);
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    this.chartData = {
      labels: this.taskStatusCounts.map(data => data.status),
      datasets: [
        {
          data: this.taskStatusCounts.map(data => data.count),
          backgroundColor: ['#F3E99F', '#FF6D60 ', '#F7D060 ', '#F3B664 '],
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'STATUS DISTRIBUTION',
          font: {
            size: 20,
          },
        },
        legend: {
          position: 'right',
        },
      },
    };

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: this.chartData,
      options: this.chartOptions,
    });
  }
}

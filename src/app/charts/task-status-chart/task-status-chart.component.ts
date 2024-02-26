import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-task-status-chart',
  standalone: true,
  imports: [],
  templateUrl: './task-status-chart.component.html',
  styleUrl: './task-status-chart.component.scss',
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
    console.log('ctx', ctx);
    this.chartData = {
      labels: this.taskStatusCounts.map(data => data.status),
      datasets: [
        {
          data: this.taskStatusCounts.map(data => data.count),
          backgroundColor: ['#CBE4DE', '#0C2233', '#065471', '#0A91AB'],
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

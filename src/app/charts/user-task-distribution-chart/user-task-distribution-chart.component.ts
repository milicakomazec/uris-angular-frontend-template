import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartOptions, Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-user-task-distribution-chart',
  standalone: true,
  imports: [],
  templateUrl: './user-task-distribution-chart.component.html',
  styleUrl: '../chart-styles.scss',
})
export class UserTaskDistributionChartComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() chartData: any = [];
  public chart!: Chart;
  public chartOptions!: ChartOptions;

  @ViewChild('userTaskDistributionChartCanvas') chartCanvas!: ElementRef;

  ngOnChanges(): void {
    if (this.chartData && this.chartCanvas) {
      this.createChart();
    }
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    Chart.register(...registerables);
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    this.chartOptions = {
      scales: {
        x: {
          ticks: {
            stepSize: 1,
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      indexAxis: 'y',
    };

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            data: this.chartData.data,
            backgroundColor: ['#FF6D60', '#F7D060', '#F3E99F', '#98D8AA'],
          },
        ],
      },
      options: this.chartOptions,
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

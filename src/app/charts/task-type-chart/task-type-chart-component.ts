import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-task-type-chart',
  standalone: true,
  templateUrl: './task-type-chart-component.html',
  styleUrl: './task-type-chart-component.scss',
})
export class TaskTypeChartComponent {
  @Input() taskTypeCounts: { type: string; count: number }[] = [];
  public chart!: Chart;
  public chartData!: ChartData;
  public chartOptions!: ChartOptions;

  @ViewChild('typeChartCanvas') chartCanvas!: ElementRef;

  ngOnChanges(): void {
    if (this.taskTypeCounts.length > 0 && this.chartCanvas) {
      this.createChart();
    }
  }

  createChart() {
    Chart.register(...registerables);
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    console.log('ctx', ctx);
    this.chartData = {
      labels: this.taskTypeCounts.map(data => data.type),
      datasets: [
        {
          data: this.taskTypeCounts.map(data => data.count),
          backgroundColor: ['#C70039', '#900C3F', '#FF5733', '#FFC300'],
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'TYPE DISTRIBUTION',
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

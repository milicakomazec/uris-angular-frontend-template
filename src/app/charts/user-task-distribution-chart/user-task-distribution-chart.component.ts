/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

interface ChartData {
  title: string;
  labels: string[];
  data: number[];
}
@Component({
  selector: 'app-user-task-distribution-chart',
  standalone: true,
  imports: [],
  templateUrl: './user-task-distribution-chart.component.html',
  styleUrl: '../chart-styles.scss',
})
export class UserTaskDistributionChartComponent {
  @Input() chartData: ChartData[] = [
    {
      title: 'Status',
      labels: [],
      data: [],
    },
    {
      title: 'Type',
      labels: [],
      data: [],
    },
  ];

  public statusPerUserChart!: Chart;
  public typePerUserChart!: Chart;

  @ViewChild('statusPerUserChartCanvas') statusChart!: ElementRef;
  @ViewChild('typePerUserChartCanvas') typeChart!: ElementRef;

  statusData: any;
  typeData: any;

  ngOnChanges(): void {
    if (this.chartData) {
      this.extractData();
      if (this.statusChart) {
        this.createStatusPerUserChart();
      }
      if (this.typeChart) {
        this.createTypePerUserChart();
      }
    }
  }

  extractData() {
    this.statusData = this.chartData.find(
      (data: { title: string }) => data.title === 'Status'
    ) || {
      title: '',
      labels: [],
      data: [],
    };
    this.typeData = this.chartData.find(
      (data: { title: string }) => data.title === 'Type'
    ) || {
      title: '',
      labels: [],
      data: [],
    };
  }

  createStatusPerUserChart() {
    if (this.statusPerUserChart) {
      this.statusPerUserChart.destroy();
    }
    Chart.register(...registerables);
    const ctx = this.statusChart.nativeElement.getContext('2d');

    this.statusPerUserChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.statusData.labels,
        datasets: [
          {
            data: this.statusData.data,
            backgroundColor: ['#FF6D60', '#F7D060', '#F3E99F', '#98D8AA'],
          },
        ],
      },
      options: {
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
      },
    });
  }

  createTypePerUserChart() {
    if (this.typePerUserChart) {
      this.typePerUserChart.destroy();
    }
    Chart.register(...registerables);
    const ctx = this.typeChart.nativeElement.getContext('2d');

    this.typePerUserChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.typeData.labels,
        datasets: [
          {
            data: this.typeData.data,
            backgroundColor: ['#FF6D60', '#F7D060', '#F3E99F', '#98D8AA'],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }
}

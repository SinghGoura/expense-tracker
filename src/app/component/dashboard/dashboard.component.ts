import { Component, ElementRef, ViewChild,AfterViewInit,OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import{Chart,registerables,ChartConfiguration} from 'chart.js';
import { DashboardService } from '../../service/dashboard.service';
import { HttpClient } from '@angular/common/http';
import { StatsService,StatsResponse } from '../../service/stats/stats.service';
// Register Chart.js plugins
Chart.register(...registerables);

interface Stats {
  balance: number;
  income: number;
  expense: number;
  latestIncome: { amount: number; title: string };
  latestExpense: { amount: number; title: string };
  minIncome: number;
  maxIncome: number;
  minExpense: number;
  maxExpense: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NzCardModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  statsData?: StatsResponse;
  errorMessage = '';
  stats: any = {};
  @ViewChild('incomeLineChartRef') incomeLineChartRef!: ElementRef;
  @ViewChild('expenseLineChartRef') expenseLineChartRef!: ElementRef;

  constructor(private dashboardService: DashboardService,private http: HttpClient,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    this.statsService.getStats().subscribe(
        data => {
            console.log('Stats data:', data);
        },
        error => {
            console.error('Error fetching stats:', error);
        }
    );
}

//   fetchDashboardData(): void {
//     this.http.get('/api/dashboard-data').subscribe(
//       data => {
//         this.stats = data;
//       },
//       error => {
//         console.error('Error fetching data:', error);
//       }
//     );
//   }

ngAfterViewInit(): void {
    // Charts will be initialized once the data is loaded in ngOnInit
  }
  createIncomeChart(): void {
    if (!this.statsData) return;

    const ctx = this.incomeLineChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.statsData.incomeHistory.dates,  // Use dynamic dates from statsData
        datasets: [
          {
            label: 'Income',
            data: this.statsData.incomeHistory.amounts,  // Use dynamic amounts from statsData
            borderColor: '#4CAF50',
            fill: false
          }
        ]
      }
    });
  }

  createExpenseChart(): void {
    if (!this.statsData) return;
    const ctx = this.expenseLineChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.statsData.expenseHistory.dates, // Dates from the expense history
        datasets: [
          {
            label: 'Expenses',
            data: this.statsData.expenseHistory.amounts, // Expense amounts from history
            borderColor: '#F44336',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
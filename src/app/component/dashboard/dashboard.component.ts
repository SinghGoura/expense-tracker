import { StatsService } from './../../service/stats/stats.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

Chart.register(CategoryScale);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NzCardModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  stats:any;
  income:any;
  expense:any;

  gridStyle ={
    width: '25%',
    textAlign:'center'
  };

  @ViewChild('incomeLineChartRef') private incomeLineChartRef:ElementRef;
  @ViewChild('expenseLineChartRef') private expenseLineChartRef:ElementRef;

  constructor(private statsService:StatsService){
   
    this.getStats();
    this.getChartData();
  }

  createLineChart(){
    const incomectx = this.incomeLineChartRef.nativeElement.getContext('2d');

    new Chart(incomectx, {
      type: 'line',
      data: {
        labels: this.income.map(income => income.date),
        datasets: [{
          label: 'income',
          data: this.income.map(income => income.amount),
          borderWidth: 1,
          backgroundColor:'rgb(80,200,120)',
          borderColor:'rgb(0,100,0)'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    const expensectx = this.expenseLineChartRef.nativeElement.getContext('2d');

    new Chart(expensectx, {
      type: 'line',
      data: {
        labels: this.expense.map(income => income.date),
        datasets: [{
          label: 'expense',
          data: this.expense.map(income => income.amount),
          borderWidth: 1,
          backgroundColor:'rgb(255,0,0)',
          borderColor:'rgb(255,0,0)'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  getStats(){
    this.statsService.getStats().subscribe(res => {
      console.log(res);
      this.stats=res;
    });
  }

  getChartData(){
    this.statsService.getChart().subscribe(res=>{
      if(res.expenseList != null  && res.incomeList !=null){
        this.income=res.incomeList;
        this.expense=res.expenseList;
        console.log(res);

        this.createLineChart();
      }
    })
  }
}

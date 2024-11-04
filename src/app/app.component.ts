import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ExpenseComponent } from './component/expense/expense.component';
import { IncomeComponent } from './component/income/income.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CoreModule,NzLayoutModule,
    NzButtonModule,NzMenuModule,NzIconModule,
    ExpenseComponent, IncomeComponent, DashboardComponent,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'expense-tracker';
  constructor(private router: Router) {}
  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}

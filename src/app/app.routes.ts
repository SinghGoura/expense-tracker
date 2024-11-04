import { Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { IncomeComponent } from './component/income/income.component';
import { ExpenseComponent } from './component/expense/expense.component';
import { LoginComponent } from './component/login/login.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';
import { ForgetComponent } from './component/forget/forget.component';
import { UpdateExpenseComponent } from './component/update-expense/update-expense.component';
import { UpdateIncomeComponent } from './component/update-income/update-income.component';
export const routes: Routes = [
    {
        path:'',
        redirectTo:'sign-up',
        pathMatch:'full'
    },
    {path:'forget',component:ForgetComponent},
    {path:'sign-up',component:SignUpComponent},
    {path:'login',component:LoginComponent},
    { path: 'dashboard', component: DashboardComponent },
    { path: 'income', component: IncomeComponent },
    { path:'income/:id/edit', component: UpdateIncomeComponent},
    { path: 'expense', component: ExpenseComponent },  // Correct way to define the route
    { path: 'expense/:id/edit', component: UpdateExpenseComponent },
    // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' } 
];

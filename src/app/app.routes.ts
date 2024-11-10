import { Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { IncomeComponent } from './component/income/income.component';
import { ExpenseComponent } from './component/expense/expense.component';
import { LoginComponent } from './component/login/login.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';
import { ForgetComponent } from './component/forget/forget.component';
import { UpdateExpenseComponent } from './component/update-expense/update-expense.component';
import { UpdateIncomeComponent } from './component/update-income/update-income.component';
import { ProtectedPageComponent } from './protected-page/protected-page.component';
import { authGuard } from './auth.guard';
export const routes: Routes = [
   
    // Publicly accessible routes
  { path: 'sign-up', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forget', component: ForgetComponent },

  // Protected routes
  { 
    path: 'protected-page',  
    component: ProtectedPageComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'income', 
    component: IncomeComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'income/:id/edit', 
    component: UpdateIncomeComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'expense', 
    component: ExpenseComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'expense/:id/edit', 
    component: UpdateExpenseComponent, 
    canActivate: [authGuard] 
  },

  // Redirect to sign-up by default if not authenticated
  { path: '', redirectTo: 'sign-up', pathMatch: 'full' },
  { path: '**', redirectTo: 'sign-up' }
];
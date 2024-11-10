import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
   imports: [RouterOutlet,NzLayoutModule,
    NzButtonModule,NzMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'expense-tracker';
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
  
  onLogout(): void {
    localStorage.removeItem('authToken'); // Remove the authentication token
    this.router.navigate(['/login']); // Redirect to login page
  }
}


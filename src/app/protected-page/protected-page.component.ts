import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-protected-page',
  standalone: true,
  imports: [],
  templateUrl: './protected-page.component.html',
  styleUrl: './protected-page.component.css'
})
export class ProtectedPageComponent {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // You can add any initialization logic here if needed
  }

  logout(): void {
    // Clear the auth token or any user session data
    localStorage.removeItem('authToken'); // Remove token from local storage
    this.router.navigate(['/login']); // Redirect to login page
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-app-footer',
  standalone: true,
  imports: [],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.css'
})
export class AppFooterComponent {
  
  constructor(private Router: Router){

  }
  
}

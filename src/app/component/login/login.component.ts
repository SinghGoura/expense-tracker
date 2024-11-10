import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ 
    ReactiveFormsModule,
    NzCardComponent,
    NzFormModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,  // This is the correct reference for HttpClient
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // Submit the login form
  submitLogin(): void {
    if (this.loginForm.valid) {
      console.log('Submitting', this.loginForm.value);
      this.http.post<any>("http://localhost:3000/api/auth/login", this.loginForm.value)
        .subscribe(
          res => {
            console.log('Login successful', res);
            localStorage.setItem('authToken', res.token);
            this.router.navigate(['/dashboard']);
          },
          err => {
            console.error('Login failed', err);
            alert("Login failed. Please check your credentials.");
          }
        );
    }
  }
  
}

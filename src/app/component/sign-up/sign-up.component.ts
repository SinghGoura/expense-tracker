import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.signupForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]], // Added email control with validators
        username: ['', [Validators.required]],  // Username control
        password: ['', [Validators.required]]   // Password control
    });
  }

  submitSignUp(): void {
    if (this.signupForm.valid) {
      this.http.post<any>('http://localhost:3000/api/auth/signup', this.signupForm.value)
        .subscribe(
          res => {
            console.log('Signup successful', res);
            localStorage.setItem('authToken', res.token); // Save token in localStorage
            this.router.navigate(['/protected']); // Redirect to a protected route
          },
          err => {
            console.error('Signup failed', err);
  
            // Check for specific error message from backend
            if (err.status === 400 && err.error.message) {
              alert(err.error.message);  // Show the backend error message (e.g., "Username already exists")
            } else {
              alert('Signup failed. Please check the entered data or try again later.');
            }
          }
        );
    } else {
      console.log('Signup form is invalid');
      alert('Please fill out all required fields correctly.');
    }
  }
  
}
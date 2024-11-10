import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth/login'; // Change this URL as needed

  constructor(private http: HttpClient) {}

  // Accept an object with username and password
  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }
}


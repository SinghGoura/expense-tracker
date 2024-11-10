// stats.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Define the structure of the response data
export interface StatsResponse {
  balance: number;
  income: number;
  expense: number;
  incomeHistory: { dates: string[]; amounts: number[] };
  expenseHistory: { dates: string[]; amounts: number[] };
  latestIncome: { amount: number; title: string } | null;
  latestExpense: { amount: number; title: string } | null;
  minIncome: number;
  maxIncome: number;
  minExpense: number;
  maxExpense: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private apiUrl = 'http://localhost:3000/api/stats'; // URL to your backend

  constructor(private http: HttpClient) {}

  // Fetch stats from the API
  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error fetching stats:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}

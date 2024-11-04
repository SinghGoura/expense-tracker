import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Change the BASE_URL to point to your Express server
const BASE_URL = "http://localhost:3000/api/expense"; // Change this to your API URL

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private http: HttpClient) { }

  // Post a new expense
  postExpense(expenseDTO: any): Observable<any> {
    return this.http.post(BASE_URL, expenseDTO);
  }

  // Get all expenses
  getAllExpenses(): Observable<any> {
    return this.http.get(BASE_URL + `/all`); // Ensure the endpoint is correct
  }

  // Delete an expense by ID
  deleteExpense(id: number): Observable<any> {
    return this.http.delete(BASE_URL +`/${id}`); // Use the Express endpoint
  }
  getExpenseById(id:number): Observable<any> {
    return this.http.get(BASE_URL + `/${id}`); // Ensure the endpoint is correct
  }

  updateExpense(id: number, expenseData: any): Observable<any> {
    return this.http.put(`${BASE_URL}/${id}`, expenseData); // Ensure the endpoint is correct and include the expense data
  }  
}

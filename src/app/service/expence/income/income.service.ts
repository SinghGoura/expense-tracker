import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = "http://localhost:3000/api/income"; // Change this to your API URL

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor(private http: HttpClient) {}

  getAllIncomes(): Observable<any> {
    return this.http.get(BASE_URL + `/all`); // Assuming your API has an endpoint for getting all incomes
  }

  postIncome(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/income', data);
  }
  

  getIncomeById(id:number): Observable<any> {
    return this.http.get<any>(BASE_URL + `/${id}`); // Assuming your API has an endpoint for getting all incomes
  }

  updateIncome(id: number, incomeData: any): Observable<any> {
    return this.http.put(`${BASE_URL}/${id}`, incomeData); // Ensure the endpoint is correct and include the expense data
  } 

  deleteIncome(id: number): Observable<any> {
    return this.http.delete(BASE_URL +`/${id}`); // Use the Express endpoint
  }
}

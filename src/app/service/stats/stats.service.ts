import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const BASE_URL = "http://localhost:3000/api/dashboard"; // Change this to your API URL

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http:HttpClient) { }
  getStats(): Observable<any> {
    return this.http.get<any>(BASE_URL + `api/stats`); // Assuming your API has an endpoint for getting all incomes
  }
  getChart(): Observable<any> {
    return this.http.get<any>(BASE_URL + `api/stats/chart`); // Assuming your API has an endpoint for getting all incomes
  }
}

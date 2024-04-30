import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CalendarDayInfo, MonthlyData, EmployeePunchingInfo, PunchTrace, MonthwiseEmployeeApiData} from './interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  //private apiUrl = '/api/v1/emp-punchings-monthly/91732772/?date=2024-04-16' // Replace '...' with your API URL
  private apiUrl = '/api/v1/emp-punchings-monthly'; // Replace '...' with your API URL
  private apiUrl2 = '/api/v1/emp-punchings'; // Replace '...' with your API URL

  constructor(private http: HttpClient) { }

  getEmployeeData(aadhaarid:string,date:string ): Observable<MonthwiseEmployeeApiData> {
    return this.http.get<MonthwiseEmployeeApiData>(`${this.apiUrl}/${aadhaarid}/?date=${date}`);
  }

  saveHint(aadhaarid:string,date:string,hint:string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl2}/${aadhaarid}/${date}`,{hint});
  }
}

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CalendarDayInfo, MonthlyData, EmployeePunchingInfo, PunchTrace, MonthwiseEmployeeApiData, EmployeeYearApiData, GovtCalendar, HolidayApiData} from './interface';

export interface LeavePreCheck{
  errors : string[] ;
  warnings : string[] ;
  prefix_holidays : string[] ;
  suffix_holidays : string[] ;
  allholidays : any;
}



@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  //private apiUrl = '/api/v1/emp-punchings-monthly/91732772/?date=2024-04-16' // Replace '...' with your API URL
  private apiUrl = '/api/v1/emp-punchings-monthly'; // Replace '...' with your API URL
  private apiUrl2 = '/api/v1/emp-punchings'; // Replace '...' with your API URL
  private apiUrl3 = '/api/v1/emp-punchings-yearly'; // Replace '...' with your API URL
  private apiUrl4 = '/api/v1/yearly-attendances'; // Replace '...' with your API URL

  constructor(private http: HttpClient) { }

  getEmployeeData(aadhaarid:string,date:string ): Observable<MonthwiseEmployeeApiData> {
    return this.http.get<MonthwiseEmployeeApiData>(`${this.apiUrl}/${aadhaarid}/?date=${date}`);
  }

  saveHint(aadhaarid:string,date:string,res:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl2}/${aadhaarid}/${date}`,res);
  }
  getEmployeeYearData(aadhaarid:string,date:string ): Observable<EmployeeYearApiData> {
    return this.http.get<EmployeeYearApiData>(`${this.apiUrl3}/${aadhaarid}/?date=${date}`);
  }
  // updateYearlyAttendance( aadhaarid:string,date:string,res:any ): Observable<any> {
  //   return this.http.patch<any>(`${this.apiUrl4}/${aadhaarid}/${date}`,res);
  // }
  updateYearlyAttendance( id:number, data:any ): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl4}/${id}/`,data);
  }

  getHolidays(date?: string): Observable<HolidayApiData> {
    return this.http.get<HolidayApiData>(`/api/v1/holidays`);
  }
  applyLeave(data:any): Observable<any> {
    return this.http.post<any>(`/api/v1/leaves/`,data);
  }
  updateLeave(id:number,  data:any): Observable<any> {
    return this.http.patch<any>(`/api/v1/leaves/${id}`,data);
  }

  precheckLeave( data:any ): Observable<any> {
    return this.http.post<LeavePreCheck>(`/api/v1/precheck-leave`,data);
  }



}

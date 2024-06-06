import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, MySectionEmployees } from './interfaces';

@Injectable({
  providedIn: 'root'
})

export interface UserFlexiSetting{
  name: string;
  aadhaarid : string;
  timeOptions: string[];
  flexi_time_wef_upcoming : string;
  flexi_minutes_upcoming : number;
  flexi_time_wef_current : string;
  flexi_minutes_current : number;
  canChangeFlexi : boolean;
}


export class EmployeePostingService {


  constructor(private httpClient: HttpClient) { }

  private apiUrl = '/api/v1/my-sectionemployees';

  fetchData(): Observable<MySectionEmployees> {
    return this.httpClient.get<MySectionEmployees>(`${this.apiUrl}`);
  }
  removeEmployee(id: any, end_date : string): Observable<any> {
    return this.httpClient.patch<any>( `${this.apiUrl}/${id}`, {
      end_date,
   } );
  }
  getUserFlexiSetting(): any {
    return this.httpClient.get<UserFlexiSetting>( `${this.apiUrl}/user-flexi-setting` );
  }
  updateEmployeeSetting(id: number, data: any): any {
    return this.httpClient.patch<any>( `${this.apiUrl}/setting/${id}`, data );
  }
  getFreeEmployees(): Observable<Employee[]> {
    return this.httpClient.get<any>(`${this.apiUrl}/unposted-employees`);
  }
  getFreeEmployeesAjax(name: string): Observable<Employee[]> {
    return this.httpClient.get<any>(`${this.apiUrl}/unposted-employees-ajax`, { params: { name } });
  }


  saveEmployee(formdata: any): Observable<any> {
    console.log(formdata);

    return this.httpClient.post<any>(`${this.apiUrl}`, formdata);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MySectionEmployees } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = '/api/v1/my-sectionemployees';

  fetchData(): Observable<MySectionEmployees> {
    return this.httpClient.get<MySectionEmployees>(`${this.apiUrl}`);
  }
  removeEmployee(id: any, end_date : string): Observable<any> {
    return this.httpClient.delete<any>( `${this.apiUrl}/${id}`, { params: { end_date } } );
  }
}

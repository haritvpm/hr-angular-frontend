import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MySectionEmployees } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpClient: HttpClient) { }

  fetchData(): Observable<MySectionEmployees> {
    const url = `/api/v1/my-sectionemployees`;
    return this.httpClient.get<MySectionEmployees>(url);
  }
}

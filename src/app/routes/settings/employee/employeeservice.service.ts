import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee.component';

@Injectable({
  providedIn: 'root'
})
export class EmployeeserviceService {

  constructor(private httpClient: HttpClient) { }

  fetchData(): Observable<Employee[]> {
    const url = `http://localhost:3000/employee`;
    return this.httpClient.get<Employee[]>(url);
  }
}

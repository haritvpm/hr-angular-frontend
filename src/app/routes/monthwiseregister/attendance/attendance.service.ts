import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Month } from './interfaces';

@Injectable({
  providedIn: 'root'
})

export class AttendanceService {

  constructor(private httpClient: HttpClient) { }

  fetchData(month: number, year: number): Observable<Month[]> {
    const url = `http://172.20.100.9:3000/attendance?month=${month}&year=${year}`;
    return this.httpClient.get<Month[]>(url);
  }
}

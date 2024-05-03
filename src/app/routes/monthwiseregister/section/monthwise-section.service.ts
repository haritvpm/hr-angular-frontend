import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonthlyApiData } from './interfaces';

@Injectable({
  providedIn: 'root'
})

export class MonthwiseSectionService {
  private apiUrl = '/api/v1/punchings-monthly'; // Replace '...' with your API URL

  constructor(private httpClient: HttpClient) { }

  fetchData(date: string): Observable<MonthlyApiData> {
    return this.httpClient.get<MonthlyApiData>(`${this.apiUrl}?date=${date}`);
  }
}

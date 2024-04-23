import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DailyPunchingApi } from './interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpClient: HttpClient) { }
  fetchData(date: string | null): Observable<DailyPunchingApi> {
    const url = date ? '/api/v1/punchings/' + date : '/api/v1/punchings/';
    return this.httpClient.get<DailyPunchingApi>(url);
  }
}

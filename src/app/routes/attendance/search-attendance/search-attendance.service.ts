import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SearchAttendanceService {
  private apiUrl = '/api/v1/search-punchings'; // Replace '...' with your API URL
  
  search(formdata: any) {
    return this.http.post<any>(`${this.apiUrl}`,formdata);

  }

  constructor(private http: HttpClient) { }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostApi } from './mattableapi.component';

@Injectable({
  providedIn: 'root'
})
export class MattableService {

  constructor(private httpClient: HttpClient) { }

  fetchData(date: string | null): Observable<PostApi> {
    const url = date ? '/api/v1/punchings/' + date : '/api/v1/punchings/';
    return this.httpClient.get<PostApi>(url);
  }
}

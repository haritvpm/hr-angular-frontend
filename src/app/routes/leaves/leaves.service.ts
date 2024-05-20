import { Injectable } from '@angular/core';
import { Employee, Leave } from '../attendance/employee/interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveToApprove extends Leave {
 employee : Employee;
 isController: boolean;
 isReportingOfficer: boolean;
}
export interface LeaveToApproveApi{
  leaves: LeaveToApprove[];
  
 }

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
  private apiUrl = '/api/v1/leaves'; 

  constructor(private http: HttpClient) { }

  getLeavesToApprove() {
    return this.http.get<LeaveToApproveApi>(`${this.apiUrl}`);

  }
}

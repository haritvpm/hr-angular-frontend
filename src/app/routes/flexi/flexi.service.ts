import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserFlexiSetting } from '../settings/employee-posting/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlexiService {



  constructor(private httpClient: HttpClient) { }

  private apiUrl = '/api/v1/my-sectionemployees';

  getFlexiApplications(): Observable<any> {
    return this.httpClient.get<any>(`/api/v1/my-flexi-applications`);
  }
  getUserFlexiSetting(): any {
    return this.httpClient.get<UserFlexiSetting>( `/api/v1/user-flexi-setting` );
  }
  saveUserFlexiSetting(data : any): any {
    return this.httpClient.post<UserFlexiSetting>( `/api/v1/my-flexi-applications`, data );
  }
  deleteUserFlexiSetting(id : number): any {
    return this.httpClient.delete<UserFlexiSetting>( `/api/v1/my-flexi-applications/${id}` );
  }
  updateEmployeeSetting(id: number, data: any): any {
    return this.httpClient.patch<any>( `${this.apiUrl}/setting/${id}`, data );
  }

  //for approval by me
  getFlexiApplicationsForApproval(): Observable<any> {
    return this.httpClient.get<any>(`/api/v1/flexi-applications`);
  }
  approveFlexiApplication(id: number) {
    return this.httpClient.post<any>( `/api/v1/flexi-applications`, {id, action: 'approve'});
  }
}

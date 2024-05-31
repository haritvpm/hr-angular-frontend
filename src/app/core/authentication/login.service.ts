import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import menudata from './../../../assets/data/menu';

import { Menu } from '@core';
import { Token, User } from './interface';
import { IProfile } from '@shared/interfaces';

export interface RegistrationPreCheck{
  errors : string[] ;
  warnings : string[] ;
}


@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/api/auth/login', { username, password, rememberMe });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/api/auth/refresh', params);
  }
  resetPassword(form: any) {
    console.log('resetPassword api');
    return this.http.post<any>('/api/auth/resetpassword', form);
  }

  logout() {
    return this.http.post<any>('/api/auth/logout', {});
  }

  me() {
    return this.http.get<User>('/api/auth/me');
  }
  getProfile() {
    return this.http.get<IProfile>('/api/auth/profile');
  }
  updateProfile(profile: Partial<IProfile>) {
    return this.http.post<Partial<IProfile>>('/api/auth/profile', profile);
  }
  menu() {
  //  return this.http.get<{ menu: Menu[] }>('/api/auth/menu').pipe(map(res => res.menu));
//return this.http
    //   .get<{ menu: Menu[] }>('/../../../assets/data/menu.json')
    //   .pipe(map(res => res.menu));
    return menudata.menu;
  }
  register(value: any) {
    return this.http.post<any>('/api/auth/register', value);
  }
  precheckRegistration( data:any ) {
    return this.http.post<RegistrationPreCheck>(`/api/auth/precheck-registration`,data);
  }
}

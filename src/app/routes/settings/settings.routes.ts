import { Routes } from '@angular/router';
//import { EmployeePostingComponent } from './employee-posting/employee-posting.component';
//import { EmployeePostingAddComponent } from './employee-posting/employee-posting-add/employee-posting-add.component';
import { unpostedEmployeesResolver } from '@core/resolvers/unpostedEmployeesResolver.resolver';
import { ApplyFlexiComponent } from '../attendance/employee/apply-flexi/apply-flexi.component';
import { userFlexiSettingsResolver } from '@core/resolvers/userFlexiSettingsResolver.resolver';

export const routes: Routes = [
  {
    path: 'employee', loadComponent: () =>
      import('./employee-posting/employee-posting.component').then(
        (mod) => mod.EmployeePostingComponent
      )
  },

  {
    path: 'employee-posting-add', loadComponent: () =>
      import('./employee-posting/employee-posting-add/employee-posting-add.component').then(
        (mod) => mod.EmployeePostingAddComponent
      ),
   //  resolve: { unpostedEmployees: unpostedEmployeesResolver }
  },
  { path: 'self/apply-flexi', component: ApplyFlexiComponent,  resolve: { emp_setting: userFlexiSettingsResolver }, },
  { path: 'self/apply-flexi/:id', component: ApplyFlexiComponent, resolve: { emp_setting: userFlexiSettingsResolver }, },

];

import { Routes } from '@angular/router';
import { EmployeePostingComponent } from './employee-posting/employee-posting.component';
import { EmployeePostingAddComponent } from './employee-posting/employee-posting-add/employee-posting-add.component';
import { unpostedEmployeesResolver } from '@core/resolvers/unpostedEmployeesResolver.resolver';

export const routes: Routes = [
  { path: 'employee', component: EmployeePostingComponent },
  { path: 'employee-posting-add', component: EmployeePostingAddComponent,  resolve: { unpostedEmployees: unpostedEmployeesResolver }  },
];

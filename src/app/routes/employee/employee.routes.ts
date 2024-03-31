import { Routes } from '@angular/router';
import { EmployeeEmployeeComponent } from './employee/employee.component';
import { ngxPermissionsGuard } from 'ngx-permissions';

export const routes: Routes = [
  {
    path: '',
    component: EmployeeEmployeeComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'MODERATOR'],
        redirectTo: '/403',
      },
    },
  },
];

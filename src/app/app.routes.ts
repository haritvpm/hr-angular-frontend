import { Routes } from '@angular/router';
import { authGuard } from '@core';
import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { Error403Component } from './routes/sessions/403.component';
import { Error404Component } from './routes/sessions/404.component';
import { Error500Component } from './routes/sessions/500.component';
import { LoginComponent } from './routes/sessions/login/login.component';
import { RegisterComponent } from './routes/sessions/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component },
      { path: 'employee', loadChildren: () => import('./routes/employee/employee.routes').then(m => m.routes) },
      { path: 'attendence', loadChildren: () => import('./routes/attendence/attendence.routes').then(m => m.routes) },
      { path: 'reporttable', loadChildren: () => import('./routes/reporttable/reporttable.routes').then(m => m.routes) },
      { path: 'subordinate', loadChildren: () => import('./routes/subordinate/subordinate.routes').then(m => m.routes) },
      { path: 'sample', loadChildren: () => import('./routes/sample/sample.routes').then(m => m.routes) },
      { path: 'tabletest', loadChildren: () => import('./routes/tabletest/tabletest.routes').then(m => m.routes) },
      { path: 'mattable', loadChildren: () => import('./routes/mattable/mattable.routes').then(m => m.routes) },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      // { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

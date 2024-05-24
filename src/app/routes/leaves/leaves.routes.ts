import { Routes } from '@angular/router';
import { LeavesApproveComponent } from './approve/approve.component';
import { EmployeeLeavesListComponent } from '../attendance/employee/employee-leaves-list/employee-leaves-list.component';

export const routes: Routes = [
    { path: 'approve', component: LeavesApproveComponent },
    { path: 'view', component: EmployeeLeavesListComponent }
];

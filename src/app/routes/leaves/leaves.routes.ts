import { Routes } from '@angular/router';
import { LeavesApproveComponent } from './approve/approve.component';
import { MyLeavesComponent } from '../attendance/employee/my-leaves/my-leaves.component';

export const routes: Routes = [
    { path: 'approve', component: LeavesApproveComponent },
    { path: 'view', component: MyLeavesComponent }
];

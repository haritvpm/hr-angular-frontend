import { Routes } from '@angular/router';
import { LeavesApproveComponent } from './approve/approve.component';
import { MyLeavesComponent } from '../attendance/employee/my-leaves/my-leaves.component';
import { ApplyLeaveComponent } from '../attendance/employee/apply-leave/apply-leave.component';

export const routes: Routes = [
    { path: 'approve', component: LeavesApproveComponent },
    { path: 'view', component: MyLeavesComponent },
    { path: 'apply-leave', component: ApplyLeaveComponent ,  },
    { path: 'apply-leave/:id', component: ApplyLeaveComponent , },

];

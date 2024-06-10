import { Routes } from '@angular/router';
import { FlexiApplyComponent } from './apply/apply.component';
import { FlexiApplicationListComponent } from './flexi-application-list/flexi-application-list.component';
import { userFlexiSettingsResolver } from '@core/resolvers/userFlexiSettingsResolver.resolver';
import { FlexiApproveComponent } from './approve/approve.component';

export const routes: Routes = [
    { path: 'apply', component: FlexiApplyComponent,  resolve: { emp_setting: userFlexiSettingsResolver }, },
    { path: 'apply/:id', component: FlexiApplyComponent},
    { path: 'view', component: FlexiApplicationListComponent   },
    { path: 'approve', component: FlexiApproveComponent   },

];

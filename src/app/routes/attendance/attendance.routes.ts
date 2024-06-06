import { Routes } from '@angular/router';
import { MonthwiseSectionAttendanceComponent } from './monthwise-section/monthwise-section.component';
import { MonthwiseregisterEmployeeComponent } from './employee/employee.component';
import { ApplyLeaveComponent } from './employee/apply-leave/apply-leave.component';
import { aadhaardateFromEmptyqueryResolver, aadhaardateFromqueryResolver } from '@core/resolvers/aadhaardateFromqueryResolver.resolver';
import { AttendanceRegisterComponent } from './daywise-section/daywise-register.component';
import { SearchAttendanceComponent } from './search-attendance/search-attendance.component';
import { ApplyFlexiComponent } from './employee/apply-flexi/apply-flexi.component';

export const routes: Routes = [
  // { path: '', component: AttendanceRegisterComponent },
  {
    path: '',
    redirectTo: 'section-daywise-register',
    pathMatch: 'full',
  },
  { path: 'section-daywise-register', component: AttendanceRegisterComponent },
  { path: 'section-monthwise-register', component: MonthwiseSectionAttendanceComponent },
  { path: 'self', component: MonthwiseregisterEmployeeComponent, resolve: { aadhaar_date: aadhaardateFromEmptyqueryResolver },    },
  { path: 'self/apply-leave', component: ApplyLeaveComponent  },
  { path: 'self/apply-leave/:id', component: ApplyLeaveComponent },

  { path: 'employee/:aadhaarid', component: MonthwiseregisterEmployeeComponent, resolve: { aadhaar_date: aadhaardateFromqueryResolver },    },
  { path: 'employee/:aadhaarid/:date', component: MonthwiseregisterEmployeeComponent, resolve: { aadhaar_date: aadhaardateFromqueryResolver },    },
  
  { path: 'search', component: SearchAttendanceComponent  },

];

import { Routes } from '@angular/router';
import { MonthwiseSectionAttendanceComponent } from './section/monthwise-section.component';
import { MonthwiseregisterEmployeeComponent } from './employee/employee.component';
import { aadhaardateFromEmptyqueryResolver, aadhaardateFromqueryResolver } from '@core/resolvers/aadhaardateFromqueryResolver.resolver';

export const routes: Routes = [{ path: '', component: MonthwiseSectionAttendanceComponent },
{ path: 'employee', component: MonthwiseregisterEmployeeComponent,     resolve: { aadhaar_date: aadhaardateFromEmptyqueryResolver }  },
{ path: 'employee/:aadhaarid', component: MonthwiseregisterEmployeeComponent,  resolve: { aadhaar_date: aadhaardateFromqueryResolver } },
{ path: 'employee/:aadhaarid/:date', component: MonthwiseregisterEmployeeComponent,  resolve: { aadhaar_date: aadhaardateFromqueryResolver } },
];

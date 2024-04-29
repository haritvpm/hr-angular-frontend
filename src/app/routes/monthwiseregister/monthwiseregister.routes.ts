import { Routes } from '@angular/router';
import { MonthwiseSectionAttendanceComponent } from './section/monthwise-section.component';
import { MonthwiseregisterEmployeeComponent } from './employee/employee.component';

export const routes: Routes = [{ path: '', component: MonthwiseSectionAttendanceComponent },
{ path: 'employee/:aadhaarid', component: MonthwiseregisterEmployeeComponent },
{ path: 'employee/:aadhaarid/:date', component: MonthwiseregisterEmployeeComponent },
];

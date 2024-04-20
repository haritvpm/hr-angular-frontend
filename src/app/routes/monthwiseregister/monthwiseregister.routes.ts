import { Routes } from '@angular/router';
import { MonthwiseregisterAttendanceComponent } from './attendance/attendance.component';
import { MonthwiseregisterEmployeeComponent } from './employee/employee.component';

export const routes: Routes = [{ path: '', component: MonthwiseregisterAttendanceComponent },
{ path: 'employee/:aadhaarid', component: MonthwiseregisterEmployeeComponent },
{ path: 'employee/:aadhaarid/:date', component: MonthwiseregisterEmployeeComponent },
];

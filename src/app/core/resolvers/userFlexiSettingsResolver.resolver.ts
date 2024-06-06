import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from '@core';
import { EmployeeService } from 'app/routes/attendance/employee/employee.service';
import { EmployeePostingService, UserFlexiSetting } from 'app/routes/settings/employee-posting/employee-posting.service';
import { switchMap, take, tap } from 'rxjs';
import { of } from 'rxjs';

export const userFlexiSettingsResolver: ResolveFn<UserFlexiSetting> = (route, state) => {
    //const auth = inject(AuthService);
    const employeePostingSrv = inject(EmployeePostingService);

    return employeePostingSrv.getUserFlexiSetting().pipe(
        take(1),
        tap((data) => console.log(data))
    );
};



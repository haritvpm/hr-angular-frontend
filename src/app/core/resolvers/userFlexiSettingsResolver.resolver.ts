import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FlexiService } from 'app/routes/flexi/flexi.service';
import { UserFlexiSettingApi } from 'app/routes/settings/employee-posting/interfaces';
import { switchMap, take, tap } from 'rxjs';
import { of } from 'rxjs';

export const userFlexiSettingsResolver: ResolveFn<UserFlexiSettingApi> = (route, state) => {
    //const auth = inject(AuthService);
    const employeePostingSrv = inject(FlexiService);

    return employeePostingSrv.getUserFlexiSetting().pipe(
        take(1),
        tap((data) => console.log(data))
    );
};



import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from '@core';
import { EmployeeArgs } from 'app/routes/monthwiseregister/employee/interface';
import { switchMap, take, tap } from 'rxjs';
import { of } from 'rxjs';

export const aadhaardateFromqueryResolver: ResolveFn<EmployeeArgs> = (route, state) => {
    const aadhaarid = route.paramMap.get('aadhaarid')!;
    const date = route.paramMap.get('date') || new Date().toISOString().slice(0, 10);
    const self = false; //route.paramMap.get('self');
    console.log('date in aadhaardateFromqueryResolver:'+date);
    return of({ aadhaarid, date, self });
};

export const aadhaardateFromEmptyqueryResolver: ResolveFn<EmployeeArgs> = (route, state) => {
    const auth = inject(AuthService);

    return auth.user()
        .pipe(
            switchMap(user => {
                console.log(user);
                if (!user.aadhaarid) {
                    throw new Error('User does not have aadhaarid');
                }
                return of({ aadhaarid: user.aadhaarid, date: new Date().toISOString().slice(0, 10), self: true });
            })
        );
};



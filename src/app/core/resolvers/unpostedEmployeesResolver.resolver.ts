import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EmployeePostingService } from 'app/routes/settings/employee-posting/employee-posting.service';
import { Employee } from 'app/routes/settings/employee-posting/interfaces';

export const unpostedEmployeesResolver: ResolveFn<Employee[]> = (route, state) => {
    //const gameId = route.paramMap.get('id');
    return inject(EmployeePostingService).getFreeEmployees();
};

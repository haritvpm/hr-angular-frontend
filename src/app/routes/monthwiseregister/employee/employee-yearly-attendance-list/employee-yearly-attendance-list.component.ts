import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MonthlyData, MonthwiseEmployeeApiData } from '../interface';
import { MatCardModule } from '@angular/material/card';
import { Injectable, inject } from '@angular/core';
import { EmployeeService } from './../employee.service';
import { Observable, map, switchMap, take, tap } from 'rxjs';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-yearly-attendance-list',
  standalone: true,
  imports: [MatCardModule, AsyncPipe, DatePipe ],
  templateUrl: './employee-yearly-attendance-list.component.html',
  styleUrl: './employee-yearly-attendance-list.component.css'
})
export class EmployeeYearlyAttendanceListComponent implements AfterViewInit{

  @Input() attendanceData : MonthwiseEmployeeApiData | null;
  private readonly employeeService = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);

  monthlyData: MonthlyData[] = [];
  aadhaarid: string | undefined = undefined;
  date: string;
  self: boolean = false;

  ngAfterViewInit (): void {
      console.log('fghfghfg ');

      this.route.data
      .pipe(
        map(data => data.aadhaar_date),
        tap(data => { this.aadhaarid = data.aadhaarid; this.date = data.date; this.self = data.self; console.log('date dfdfd:' + data.date); }),
        switchMap(data => this.employeeService.getEmployeeYearData(data.aadhaarid, data.date)),
        take(1)
      )
      .subscribe(response => {
        console.log(response);
        this.monthlyData = response.allmonthdata;
        console.log(this.monthlyData);
      });

    }
}

import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MonthlyData, MonthwiseEmployeeApiData } from '../interface';
import { MatCardModule } from '@angular/material/card';
import { Injectable, inject } from '@angular/core';
import { EmployeeService } from './../employee.service';
import { Observable, map, switchMap, take, tap } from 'rxjs';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditPreviousLeavesComponent } from '../edit-prev-leaves/edit-previous-leaves.component';

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
  constructor(private dialog: MatDialog) {}

  ngAfterViewInit (): void {

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
    openDialog(): void {
      const dialogRef = this.dialog.open(EditPreviousLeavesComponent, {
        data: {
          cl_start: this.attendanceData?.data_yearly.start_with_cl,
          compen_start: this.attendanceData?.data_yearly.start_with_compen},
      });

      dialogRef.afterClosed().subscribe(result => {
       // console.log('The dialog was closed'+result.start_with_cl);
        //this.animal = result;
        if( result?.start_with_cl || result?.start_with_compen){
          // this.employeeService.updateYearlyAttendance(
          //   this.aadhaarid!,
          //   this.attendanceData!.data_yearly.year,
          //   result).subscribe(response => {
          //   //console.log(response);

          // });

          this.employeeService.updateYearlyAttendance(
            this.attendanceData!.data_yearly.id,
            {
              aadhaarid: this.aadhaarid!,
              year: this.attendanceData!.data_yearly.year,
              start_with_cl: result.start_with_cl,
              start_with_compen: result.start_with_compen
            }).subscribe(response => {
              //optimistic update
              this.attendanceData!.data_yearly.start_with_cl = result.start_with_cl;
              this.attendanceData!.data_yearly.start_with_compen = result.start_with_compen;

          });
        }
      });
    }

}

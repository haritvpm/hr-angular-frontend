import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDatepickerInputEvent, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AttendanceService } from './attendance.service';
import { EmployeeAttendance } from './interfaces';
import * as _moment from 'moment';

import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-monthwiseregister-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  standalone: true,
  imports: [HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, FormsModule, CommonModule, ReactiveFormsModule],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})


export class MonthwiseregisterAttendanceComponent {
  displayedColumns: string[] = ['empid', 'name', 'date1', 'date2'];
  dataSource = new MatTableDataSource<EmployeeAttendance>();
  selectedMonth: Date | null = null;
  date = new FormControl(moment());

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private attendanceService: AttendanceService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    let monthNumber = 0, yearNumber = 0;
    if (ctrlValue) {
      monthNumber = normalizedMonth.month() + 1;
      yearNumber = normalizedMonth.year();
    }
    datepicker.close();
    this.attendanceService.fetchData(monthNumber, yearNumber).subscribe((data) => {
      if (data) {
        // Handle the data returned from the API
        const empDetArray = data[0];
        console.log(empDetArray.empDet);
        // Assign the data to your dataSource for display in the table
        this.dataSource = new MatTableDataSource<EmployeeAttendance>(empDetArray.empDet);
      }
    });
  }
}

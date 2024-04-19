import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AttendanceService } from './attendance.service';
import { MonthlyPunching, MonthlyApiData } from './interfaces';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { catchError } from 'rxjs';
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HttpClientModule, MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, FormsModule, CommonModule, ReactiveFormsModule],
  providers: [

    provideMomentDateAdapter(MY_FORMATS),

  ],
})


export class MonthwiseregisterAttendanceComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<MonthlyPunching>([]);
  dayColumns: any;
  calendarInfo: any;
  selectedMonth: string = moment().format('YYYY-MM-DD');
  selectedMonthHint: string = moment().format('MMMM YYYY');
  date = new FormControl(moment());
  //today's date
  todayDate: Date = new Date();

  //any date
  beginDate: Date = new Date('2024-01-01');

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.loadData();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadData() {
    this.attendanceService.fetchData(this.selectedMonth)
      .pipe(catchError(() => {
        console.log('Error in fetching data');
        return [];
      }))
      .subscribe((data) => {
        if (data && data?.calender_info) {
          const empDetArray = data?.monthlypunchings;
          console.log(data);
          this.calendarInfo = data.calender_info;
          this.dayColumns = Object.keys(data.calender_info);
          this.displayedColumns = [ 'name', ...this.dayColumns];
          // Assign the data to your dataSource for display in the table
          this.selectedMonthHint = moment(this.selectedMonth).format('MMMM YYYY');
          this.dataSource = new MatTableDataSource<MonthlyPunching>(empDetArray);
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource = new MatTableDataSource<MonthlyPunching>([]);
        }
      });
  }

  chosenMonthHandler(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    console.log(normalizedMonthAndYear.format('YYYY-MM-DD'));
    this.selectedMonth = normalizedMonthAndYear.format('YYYY-MM-DD');
    this.loadData();
  }
}

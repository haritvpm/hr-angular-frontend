import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild, ChangeDetectionStrategy,ViewEncapsulation } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule,  MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AttendanceService } from './attendance.service';
import { MonthlyPunching, MonthlyApiData } from './interfaces';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import {MatFormFieldModule} from '@angular/material/form-field';
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
  imports: [HttpClientModule,MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, FormsModule, CommonModule, ReactiveFormsModule],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
 // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_FORMATS),
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },

    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})


export class MonthwiseregisterAttendanceComponent {
  displayedColumns: string[] = ['aadhaarid', 'name'];
  dataSource = new MatTableDataSource<MonthlyPunching>([]);
  dayColumns : any
  calendarInfo: any;
 // selectedMonth: Date | null = null;
  date = new FormControl(moment());
  //today's date
  todayDate:Date = new Date();

  //any date
  beginDate: Date = new Date('2024-01-01');

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

  chosenMonthHandler(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
   // this.selectedMonth = normalizedMonth.format('YYYY-MM')
   const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    console.log(normalizedMonthAndYear.format('YYYY-MM-DD'));
    
    this.attendanceService.fetchData( normalizedMonthAndYear.format('YYYY-MM-DD') ).subscribe((data) => {
    
        const empDetArray = data.monthlypunchings;
        this.calendarInfo = data.calender_info;
        this.dayColumns = Object.keys(data.calender_info);
        this.displayedColumns = ['aadhaarid', 'name', ...this.dayColumns];
        // Assign the data to your dataSource for display in the table
        this.dataSource = new MatTableDataSource<MonthlyPunching>(empDetArray);
        this.dataSource.paginator = this.paginator;
    });
  }
}

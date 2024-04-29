import { CommonModule } from '@angular/common';
import { Component, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { MonthwiseSectionService } from './monthwise-section.service';
import { PunchingInfo, MonthlyPunching, MonthlyApiData } from './interfaces';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { catchError } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CellComponent } from './cell/cell.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
const moment = _rollupMoment || _moment;
import { MTX_DRAWER_DATA, MtxDrawer, MtxDrawerRef } from '@ng-matero/extensions/drawer';
import { MarkHintDrawerComponent } from '@shared/components/mark-hint-drawer/mark-hint-drawer.component';

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
  templateUrl: './monthwise-section.component.html',
  styleUrls: ['./monthwise-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
  ],
  imports: [
    RouterLink,
    HttpClientModule, MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule, MatTooltipModule,
    MatSortModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatIconModule,
    MatNativeDateModule, FormsModule, CommonModule, ReactiveFormsModule,
    CellComponent,
    BreadcrumbComponent, MatProgressBarModule
  ]
})


export class MonthwiseSectionAttendanceComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<MonthlyPunching>([]);
  dayColumns: any;
  calendarInfo: any;
  selectedMonth: string = moment().format('YYYY-MM-DD');
  selectedMonthHint: string = moment().format('MMMM YYYY');
  date = new FormControl(moment());
  isLoading = false;
  //today's date
  todayDate: Date = new Date();
  beginDate: Date = new Date('2024-01-01');
  sections: string[] = [];
  public selectedSection = 'All';
  public searchTxt = '';
  public searchForm: FormGroup;

  constructor(private attendanceService: MonthwiseSectionService, private drawer: MtxDrawer) { }

  ngOnInit(): void {
    this.searchFormInit();

    this.loadData();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;


  applyFilter() {
    const searchTxt = this.searchForm.get('searchTxt')?.value;
    let section = this.searchForm.get('selectedSection')?.value;

    this.searchTxt = searchTxt === null ? '' : searchTxt;
    this.selectedSection = section === null ? '' : section;

    if (section === 'All') section = '';

    // console.log('t'+searchTxt);
    // console.log('s'+section);

    this.dataSource.filter = searchTxt.toLowerCase() + '$' + section.toLowerCase();

  }

  filterNonFutureDays(obj: any): any {
    const current_days: string[] = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (!value.future_date) {
          current_days.push(key);
        }
      }
    }
    return current_days;
  }

  loadData() {
    this.isLoading = true;
    this.attendanceService.fetchData(this.selectedMonth)
      .pipe(catchError(() => {
        console.log('Error in fetching data');
        this.isLoading = false;
        return [];
      }))
      .subscribe((data) => {
        if (data && data?.calender_info) {
          const empDetArray = data?.monthlypunchings;
          // console.log(data);
          this.calendarInfo = data.calender_info;
          //find keys where the object's value is not future_date

          this.dayColumns = this.filterNonFutureDays(data.calender_info);// Object.keys(data.calender_info.filter( x => !x.future_date));
          this.displayedColumns = ['name', 'grace_left', ...this.dayColumns, 'extra', 'info'];

          //  this.sections =['All'];
          this.sections = data.sections ? ['All', ...data.sections] : ['All'];
          // Assign the data to your dataSource for display in the table
          this.selectedMonthHint = moment(this.selectedMonth).format('MMMM YYYY');
          // console.log(empDetArray);
          this.dataSource = new MatTableDataSource<MonthlyPunching>(empDetArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.filterPredicate = this.getFilterPredicate();
          this.applyFilter();

        } else {
          this.dataSource = new MatTableDataSource<MonthlyPunching>([]);

        }

        this.isLoading = false;
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

  searchFormInit() {
    this.searchForm = new FormGroup({
      searchTxt: new FormControl(''),
      selectedSection: new FormControl('')
    });
  }

  /* this method well be called for each row in table  */
  getFilterPredicate() {
    return (row: MonthlyPunching, filters: string) => {

      // split string per '$' to array
      const filterArray = filters.split('$');
      const searchTxt = filterArray[0];
      const section = filterArray[1];
      // console.log('searchTxt'+searchTxt);
      const matchFilter = [];

      // Fetch data from row
      const columnName = row.aadhaarid + row.name + row.designation;
      const columnSection = row?.section_name || '';
      // console.log('section'+section+';');
      // console.log('columnSection'+columnSection+';');

      // verify fetching data by our searching values

      const customFilterN = columnName.toLowerCase().includes(searchTxt);
      const customFilterS = columnSection.toLowerCase() == section || section == '' || section == 'All';

      // push boolean values into array
      matchFilter.push(customFilterN);
      matchFilter.push(customFilterS);

      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }

  getCellBackgroundColor(dayN: string, odd: boolean) {
    if (this.calendarInfo[dayN].holiday) return '#7f7f7f0e';

    return '';
    //  return odd ? '#FAFAFA' : '#FFFFFF';
  }
  graceLeft(row: MonthlyPunching) {
    const grace = row?.total_grace_sec || 0;
    return Math.ceil(300 - grace / 60);
  }
  getGraceStyle(row: MonthlyPunching) {
    const grace = this.graceLeft(row);
    if (grace < 0) return 'color: red; font-weight: bold';
    if (grace < 30) return 'color: orange;  font-weight: bold';
    if (grace < 60) return 'color: darkblue';

    return '';
  }
  getExtraStyle(row: MonthlyPunching) {
    const extra = this.extraTime(row);
    return extra > 600 ? 'color: green; font-weight: bold' : '';

  }
  extraTime(row: MonthlyPunching) {
    const extra = row?.total_extra_sec || 0;
    return Math.ceil(Math.max(extra / 60, 0));
  }
  getTooltip(dayN: string, row: any) {
    const rowVal = row[dayN];
    let tip = rowVal.name + '\n';
    const hint = rowVal.hint ? rowVal.hint : rowVal.computer_hint ? rowVal.computer_hint : '';

    if (rowVal?.punching_count == 0) tip += 'No Punching. ' + hint;
    else if (rowVal?.punching_count == 1) tip += (rowVal?.in_time || rowVal?.out_time) + hint;

    else {
      tip += rowVal?.in_time + '-' + rowVal?.out_time + '\n' + hint;

      tip += '\n Grace (min): ' + Math.round(rowVal?.grace_sec / 60);
      tip += '\n Extra (min): ' + Math.round(rowVal?.extra_sec / 60);
      if (rowVal.grace_exceeded300_and_today_has_grace) tip += '\n Grace > 300 min';
      //tip += '\n Grace exceeded by (min) : ' + Math.round(rowVal?.grace_total_exceeded_one_hour/60) ;

    }
    return tip;
  }

  mark(day_number: string, dayNData: PunchingInfo) {
    console.log(dayNData);
    console.log( this.calendarInfo[day_number]);
    if (this.calendarInfo[day_number].holiday && dayNData.punching_count == 0  ) return;

    const drawerRef = this.drawer.open(MarkHintDrawerComponent, {
      width: '300px',
      data: { punchingInfo: dayNData },
    });

    drawerRef.afterDismissed().subscribe(result => {
      console.log('The drawer was dismissed - ' + result);
      // this.animal = result;
    });
  }

}

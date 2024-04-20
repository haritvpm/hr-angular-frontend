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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AttendanceService } from './attendance.service';
import { PunchingInfo, MonthlyPunching, MonthlyApiData } from './interfaces';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { catchError } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatPaginatorModule,MatTooltipModule,
    MatSortModule, MatInputModule, MatSelectModule,
    MatDatepickerModule,MatIconModule,
    MatNativeDateModule, FormsModule, CommonModule, ReactiveFormsModule],
  providers: [

    provideMomentDateAdapter(MY_FORMATS),

  ],
})


export class MonthwiseregisterAttendanceComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<MonthlyPunching>([]);
  dayColumns: any;
  calendarInfo: any;
  selectedMonth: string = moment().format('YYYY-MM-DD');
  selectedMonthHint: string = moment().format('MMMM YYYY');
  date = new FormControl(moment());

  //today's date
  todayDate: Date = new Date();
  beginDate: Date = new Date('2024-01-01');
  sections: string[] = [];
  public selectedSection = 'All';
  public searchTxt = '';
  public searchForm: FormGroup;


  constructor(private _liveAnnouncer: LiveAnnouncer,
    private attendanceService: AttendanceService) { }

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

    if(section === 'All') section = '';

console.log('t'+searchTxt);
console.log('s'+section);

    this.dataSource.filter = searchTxt  + '$' + section;

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
          this.displayedColumns = [ 'name', ...this.dayColumns,'grace_left', 'extra' ,'info'];

        //  this.sections =['All'];
          this.sections = data.sections ? ['All',...data.sections] : ['All'];
          // Assign the data to your dataSource for display in the table
          this.selectedMonthHint = moment(this.selectedMonth).format('MMMM YYYY');
          this.dataSource = new MatTableDataSource<MonthlyPunching>(empDetArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.filterPredicate = this.getFilterPredicate();
          this.applyFilter();
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
      const customFilterS = columnSection.toLowerCase() == section.toLowerCase() || section == '' || section == 'All';

      // push boolean values into array
      matchFilter.push(customFilterN);
      matchFilter.push(customFilterS);

      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }

  getCellBackgroundColor( dayN : string, odd: boolean) {
    if(this.calendarInfo[dayN].holiday) return '#FFCDD23F';

    return odd ? '#FAFAFA' : '#FFFFFF'
  }
  graceLeft(row: MonthlyPunching){
    const grace = row?.total_grace_sec || 0;
    return Math.ceil(300 - grace/60)
  }
  getGraceStyle(row: MonthlyPunching){
    const grace = this.graceLeft(row);
    if(grace < 0) return 'color: red';
    if(grace < 30) return 'color:  orange'; 
    if(grace < 60) return 'color: darkblue';

    return ''
  }
  extraTime(row: MonthlyPunching){
    const extra = row?.total_extra_sec || 0;
    return Math.ceil(Math.max(extra/60,0))
  }
  getTooltip(dayN: string, row: any){
    let tip = ''
    if(row[dayN]?.punching_count == 0) return 'No Punching';
    if(row[dayN]?.punching_count == 1) return row[dayN]?.in_time || row[dayN]?.out_time;

    return '' + row[dayN]?.in_time + ' - ' + row[dayN]?.out_time;

  }
}

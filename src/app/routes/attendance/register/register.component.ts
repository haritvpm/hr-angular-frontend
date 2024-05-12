import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDatepickerInputEvent, MatDatepicker } from '@angular/material/datepicker';
import { RegisterService } from './register.service';
import { Calender, DailyPunching } from './interface';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MTX_DRAWER_DATA, MtxDrawer, MtxDrawerRef } from '@ng-matero/extensions/drawer';
import { EmployeeService } from 'app/routes/monthwiseregister/employee/employee.service';
import { MarkHintDrawerComponent } from '@shared/components/mark-hint-drawer/mark-hint-drawer.component';
import { leaveList } from '@shared/components/mark-hint-drawer/leave-types';
import { DurationCellComponent } from './duration-cell/duration-cell.component';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-mattable-mattableapi',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [MatTableModule, RouterLink,
    MatPaginatorModule,
    MatSortModule, CommonModule, MatInputModule,
    MatDatepickerModule, MatIconModule, MatBadgeModule,
    FormsModule, ReactiveFormsModule, NgIf,
    MatTooltipModule, MatSelectModule, MatButtonModule, DurationCellComponent]
})

export class AttendanceRegisterComponent implements OnInit {
  displayedColumns: string[] = ['name', 'section', 'inTrace', 'outTrace', 'duration_str',  'grace_str', 'total_grace_sec', 'grace_left', 'extra_str',  'total_extra_sec','cl_mark_sub', 'comb_mark_sub', 'remarks'];
  dataSource = new MatTableDataSource<DailyPunching>();
  data: DailyPunching[] = [];
  is_future: boolean;
  is_today: boolean;
  is_holiday: boolean;
  date_dmY: string;
  // selectedDate: string = moment().format('YYYY-MM-DD');
  selectedDateHint: string = moment().format('DD MMMM YYYY');
  date = new FormControl(moment());
calender: Calender;
  //today's date
  todayDate: Date = new Date();
  beginDate: Date = new Date('2024-01-01');
  sections: string[] = [];
  public selectedSection = 'All';
  public searchTxt = '';
  public searchForm: FormGroup;


  // Define an array to hold the combined data
  combinedData: { name: string, designation: string }[] = [];


  constructor(private registerService: RegisterService,
    private _liveAnnouncer: LiveAnnouncer, private drawer: MtxDrawer,
    private employeeService: EmployeeService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('picker') picker: MatDatepicker<Date>;


  ngOnInit() {

    this.fetchData(null);
    this.searchForm = new FormGroup({
      searchTxt: new FormControl(''),
      selectedSection: new FormControl('')
    });


  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // applyFilter(filterValue: string) {

  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
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

  fetchData(date: string | null) {
    this.registerService.fetchData(date).subscribe((data) => {
      this.data = data.punchings;
      this.is_future = data.is_future;
      this.is_today = data.is_today;
      this.is_holiday = data.is_holiday;
      this.date_dmY = data.date_dmY;
      this.calender = data.calender;
      console.log(data);
      // console.log(this.data);
      this.sections = data.sections ? ['All', ...data.sections] : ['All'];
      this.dataSource.data = this.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.getFilterPredicate();
      this.applyFilter();
      // this.searchFormInit();


    });

  }
  // searchFormInit() {
  //   this.searchForm = new FormGroup({
  //     searchTxt: new FormControl(''),
  //     selectedSection: new FormControl('')
  //   });
  // }
  getFilterPredicate() {
    return (row: DailyPunching, filters: string) => {

      // split string per '$' to array
      const filterArray = filters.split('$');
      const searchTxt = filterArray[0];
      const section = filterArray[1].replace('/', '');
      // console.log('searchTxt'+searchTxt);
      const matchFilter = [];

      // Fetch data from row
      const columnName = row.aadhaarid + row.name + row.designation;
      const columnSection = row?.section || '';
      const attendance_book = row.attendance_book?.title || '';
      // console.log('section'+section+';');
      // console.log('columnSection'+columnSection+';');

      // verify fetching data by our searching values

      const customFilterN = columnName.toLowerCase().includes(searchTxt);
      const customFilterS = columnSection.toLowerCase() == section || section == '' || section == 'All' || attendance_book.toLowerCase().includes(section);

      // push boolean values into array
      matchFilter.push(customFilterN);
      matchFilter.push(customFilterS);

      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }


  dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value !== null && event.value !== undefined) {
      const newdate = moment(event.value);
      // this.selectedDate = newdate.format('YYYY-MM-DD');
      this.date.setValue(newdate);
      this.selectedDateHint = newdate.format('DD MMM YYYY');
      this.fetchData(newdate.format('YYYY-MM-DD'));
    } else {
      // Handle the case where event.value is undefined
      console.log('Datepicker value is undefined');
    }
  }

  roundValue(value: number): number {
    return Math.round(value);
  }

  getGraceStyleTotal(employee: any) {
    const graceTot = this.roundValue(employee.total_grace_sec / 60);
    if (graceTot > 300)
      return {
        // 'background-color':exeeded ? 'yellow':'',
        'font-weight': 'bold',
        'color': 'red'
      };
    else if (graceTot > 250)
      return {
        'font-weight': 'bold',
        'color': 'orange'
      };
      else
      return {
        '':''
      };
  }

  getExtratimeColor(employee: any) {
    const extraTimeexeed = this.roundValue(employee.total_extra_sec / 60) >= 600;
    return {
      'font-weight': extraTimeexeed ? 'bold' : '',
      'color': extraTimeexeed ? 'green' : ''
    };
  }
  getGraceStyle(employee: any) {
    if (employee.grace_str > 60) return {
      'color': 'red',
      'font-weight': 'bold'
    };
    // if (employee.grace_str > 30) return {
    //   'color': 'orange',
    //   'font-weight': 'bold'

    // };

    else
      return {
        'color': '',
        'font-weight': ''
      };
  }


  getTooltipContent(employee: any): string {
    let tooltipContent = employee.name + '\n';
    if (employee.punching_count === 0) {
      tooltipContent += '\n"No Punching"';
    } else if (employee.punching_count < 2) {
      tooltipContent += '\n"Missing Punch Out"';
    }
    return tooltipContent;
  }
  onNextDay() {

    const nextday = moment(this.date.value).add(1, 'day');
    //if this is future month, ignore
    if (nextday.isAfter(moment(), 'day')) return;
    // this.selectedDate = nextday.format('YYYY-MM-DD');
    this.selectedDateHint = moment(nextday).format('DD MMM YYYY');
    this.date.setValue(nextday);

    this.fetchData(nextday.format('YYYY-MM-DD'));
  }
  onPrevDay() {
    const prevday = moment(this.date.value).subtract(1, 'day');
    //if this is before 2024 january month, ignore
    if (prevday.isBefore(this.beginDate, 'day')) return;
    // this.selectedDate = prevday.format('YYYY-MM-DD');
    this.selectedDateHint = moment(prevday).format('DD MMM YYYY');
    this.date.setValue(prevday);

    this.fetchData(prevday.format('YYYY-MM-DD'));
  }

  mark(row: DailyPunching) {
    //console.log(row);
  //  if (this.is_holiday && row.punching_count == 0) return;
  // if (this.is_future) return;

    const drawerRef = this.drawer.open(MarkHintDrawerComponent, {
      width: '300px',
      data: { punchingInfo: row, monthlyPunching: row, calender: this.calender},
    });

    drawerRef.afterDismissed().subscribe(res => {
      console.log('The drawer was dismissed - ' + res);

      if (!res?.hint && !res?.single_punch_type) return;

      if (
        (!res?.hint && !res?.remarks)
        &&
        (res?.isSinglePunch  && !res?.single_punch_type)

      ) return;

      if (!row.logged_in_user_is_controller && !row.logged_in_user_is_section_officer) return;
      if (!row.logged_in_user_is_controller &&  //js is both so and co
        row.logged_in_user_is_section_officer &&  //disallow only if so
        row.finalized_by_controller
      ) return;

      this.employeeService.saveHint(row.aadhaarid, this.date_dmY, res).subscribe((_data) => {
        this.fetchData(moment(this.date.value).format('YYYY-MM-DD'));
      });
    });
  }



}



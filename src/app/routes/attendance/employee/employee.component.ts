import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { CalendarDayInfo, MonthlyData, EmployeePunchingInfo, PunchTrace, MonthwiseEmployeeApiData, Employee, YearlyData, Leave } from './interface';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { map, switchMap, take, tap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import moment, { Moment } from 'moment';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { EmployeeLeavesListComponent } from './employee-leaves-list/employee-leaves-list.component';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MTX_DRAWER_DATA, MtxDrawer, MtxDrawerRef } from '@ng-matero/extensions/drawer';
import { MarkHintDrawerComponent } from '@shared/components/mark-hint-drawer/mark-hint-drawer.component';
import { EmployeeYearlyAttendanceListComponent } from './employee-yearly-attendance-list/employee-yearly-attendance-list.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
  selector: 'app-monthwiseregister-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatTableModule, DatePipe, NgIf, MatFormField, MatLabel,
    MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatTabsModule,
    EmployeeLeavesListComponent, MatDatepickerModule, MatNativeDateModule,
    FormsModule, CommonModule, ReactiveFormsModule, EmployeeYearlyAttendanceListComponent, MatProgressBarModule],
  providers: [provideMomentDateAdapter(MY_FORMATS),],

})

export class MonthwiseregisterEmployeeComponent implements OnInit {
  aadhaarid: string | undefined = undefined;
  date: string;
  self: boolean = false;
  data: MonthwiseEmployeeApiData | null = null;
  dataSource = new MatTableDataSource<EmployeePunchingInfo>();
  displayedColumns: string[] = ['day', 'punchin', 'punchout', 'duration', 'grace', 'xtratime', 'info'];
  // clickedRows = new Set<EmployeePunchingInfo>();
  calender_info: { [day: string]: CalendarDayInfo } = {};
  employeeInfo: Employee | null;
  monthlyData: MonthlyData | null;
  yearlyData: YearlyData | null;
  todayDate: Date = new Date();
  beginDate: Date = new Date('2024-01-01');
  date_formctrl = new FormControl(moment());
  employeeLeaves: Leave[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: EmployeeService,
    private drawer: MtxDrawer,

  ) { }

  ngOnInit(): void {

    console.log('ngOnInit');
    this.route.data
      .pipe(
        map(data => data.aadhaar_date),
        tap(data => { this.aadhaarid = data.aadhaarid; this.date = data.date; this.self = data.self; console.log('date dfdfd:' + data.date); }),
        switchMap(data => this.apiService.getEmployeeData(data.aadhaarid, data.date)),
        take(1)
      )
      .subscribe(response => {
        console.log(response);
        this.data = response;
        this.dataSource.data = this.data.employee_punching;
        this.employeeInfo = this.data.employee;
        this.monthlyData = this.data.data_monthly;
        this.yearlyData = this.data.data_yearly;
        this.employeeLeaves = this.data.emp_leaves;
        this.calender_info = this.data.calender_info;
      });

  }

  getHolidayStyle(dateItem: any) {
    if (dateItem.is_holiday)
      return {
        'color': 'red',
        //'font-weight': 'bold',
        'margin-left': '4vh'
      };
    else if (dateItem.is_future)
      return {
        'color': 'grey',
        'margin-left': '4vh'
      };
    else if (dateItem.is_today)
      return {
        'font-weight': 'bold',
        'margin-left': '4vh'
      };
    else
      return { 'margin-left': '4vh' };
  }

  onNextMonth() {

    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';

    const nextmonth = moment(this.date).add(1, 'month');
    //if this is future month, ignore
    if (nextmonth.isAfter(moment(), 'month')) return;
    this.router.navigate(['/attendance/employee/', this.aadhaarid, nextmonth.format('YYYY-MM-DD')]);

  }
  onPrevMonth() {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';

    const prevmonth = moment(this.date).subtract(1, 'month');
    //if this is before 2024 january month, ignore
    if (prevmonth.isBefore(this.beginDate, 'month')) return;
    console.log('prev month:', prevmonth.format('YYYY-MM-DD'));
    this.router.navigate(['/attendance/employee/', this.aadhaarid, prevmonth.format('YYYY-MM-DD')]);
  }
  chosenMonthHandler(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment> | null) {
    const ctrlValue = this.date_formctrl.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date_formctrl.setValue(ctrlValue);
    if (datepicker) datepicker.close();
    console.log(normalizedMonthAndYear.format('YYYY-MM-DD'));
    //this.selectedMonth = normalizedMonthAndYear.format('YYYY-MM-DD');
    // this.loadData();
    this.router.navigate(['/employee/', this.aadhaarid, normalizedMonthAndYear.format('YYYY-MM-DD')]);

  }
  mark(row: EmployeePunchingInfo) {
    console.log(row);
    //  if (this.is_holiday && row.punching_count == 0) return;

    const drawerRef = this.drawer.open(MarkHintDrawerComponent, {
      width: '300px',
      data: {
        punchingInfo: row,
        monthlyPunching: this.monthlyData,
        yearlyPunching: this.yearlyData,
        calender: this.calender_info[row.day]
      },
    });

    drawerRef.afterDismissed().subscribe(res => {
      console.log('The drawer was dismissed - ' + res);

      if (!res?.hint && !res?.single_punch_type) return;


      if (
        (!res?.hint && !res?.remarks)
        &&
        (res?.isSinglePunch && !res?.single_punch_type)

      ) return;

      if (!row.logged_in_user_is_controller && !row.logged_in_user_is_section_officer) return;
      if (!row.logged_in_user_is_controller &&  //js is both so and co
        row.logged_in_user_is_section_officer &&  //disallow only if so
        row.finalized_by_controller
      ) return;

      this.apiService.saveHint(row.aadhaarid, row.date, res).subscribe((_data) => {
        console.log('hint saved');
        this.router.navigate(['/employee/', this.aadhaarid, row.date]);
        //  this.fetchData(moment(this.date.value).format('YYYY-MM-DD'));
      });
    });
  }

  getPercentage(dateItem: any) {
    const duration = dateItem.duration_sec;
    const duration_percent = (duration / 25200) * 100;
    return duration_percent;
  }
}


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { CalendarDayInfo, MonthlyData, EmployeePunchingInfo, PunchTrace, MonthwiseEmployeeApiData, Employee } from './interface';
import { DatePipe, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { switchMap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import moment from 'moment';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-monthwiseregister-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [MatTableModule, DatePipe, NgIf, MatFormField, MatLabel,
    MatInputModule, MatButtonModule, MatIconModule]
})

export class MonthwiseregisterEmployeeComponent implements OnInit {
  aadhaarid: string;
  date: string;
  data: MonthwiseEmployeeApiData;
  dataSource = new MatTableDataSource<EmployeePunchingInfo>();
  displayedColumns: string[] = ['day', 'punchin', 'punchout', 'duration', 'xtratime', 'info'];
  clickedRows = new Set<EmployeePunchingInfo>();
  employeeInfo: Employee | null;
  monthlyData: MonthlyData | null;
  beginDate: Date = new Date('2024-01-01');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => {
          console.log(params);
          this.aadhaarid = params.aadhaarid;
          this.date = params.date || new Date().toISOString().slice(0, 10);
          return this.apiService.getEmployeeData(this.aadhaarid, this.date);
        })
      )
      .subscribe(response => {
        console.log(response);
        this.data = response;
        this.dataSource.data = this.data.employee_punching;
        this.employeeInfo = this.data.employee;
        this.monthlyData = this.data.data_monthly[this.aadhaarid];
        console.log(this.monthlyData);
      });
  }

  getCellBgcolor(dateItem: any) {
    let dayColor = '';
    // if (dateItem.is_holiday != '1' && !dateItem.is_future) {
    //   dayColor = (dateItem.punching_count <= '0') ? '#EF9A9A' : '';
    //   if (dateItem.punching_count == '1' && !dateItem.is_today) {
    //     dayColor = '#FFE082';
    //   }
    // } else
    if (dateItem.is_future)
      dayColor = '#BDBDBD';
    return {
      'background-color': dayColor,
      'text-align': 'center'
    };
  }

  getDateStyle(dateItem: any) {
    // if (dateItem.attendance_trace_fetch_complete) {
    if (!dateItem.is_holiday && !dateItem.is_future)
      // dateColorSet = (dateItem.punching_count <= '0') ? '#EF9A9A' : '';
      // if (dateItem.punching_count <= '1' ) {
      // dateColorSet = '#FFE082';
      if (dateItem.punching_count < '1')
        return {
          'font-weight': 'bold',
          'color': 'deeppink'
        };
      else if (dateItem.punching_count == '1')
        return {
          'font-weight': 'bold',
          'color': 'orange;'
        };
      else
        return '';
    // }
    else if (dateItem.is_future)
      return {
        'background-color': '#BDBDBD'
      };
    // dateColorSet = '#78909C';
    // }

    else return '';
  }

  getHolidayStyle(dateItem: any) {
    // const holiday = (dateItem.is_holiday == 1) ? 'red' : '';
    if (dateItem.is_holiday)
      return {
        'color': 'red',
        'font-weight': 'bold'
      };
    // else if (dateItem.is_future)
    //   return {
    //     'background-color': '#78909C'
    //   };
    else
      return '';
  }

  onNextMonth() {

    const nextmonth = moment(this.date).add(1, 'month');
    //if this is future month, ignore
    if (nextmonth.isAfter(moment(), 'month')) return;
    this.router.navigate(['/monthwiseregister/employee/', this.aadhaarid, nextmonth.format('YYYY-MM-DD')]);

  }
  onPrevMonth() {
    const prevmonth = moment(this.date).subtract(1, 'month');
    //if this is before 2024 january month, ignore
    if (prevmonth.isBefore(this.beginDate, 'month')) return;
    this.router.navigate(['/monthwiseregister/employee/', this.aadhaarid, prevmonth.format('YYYY-MM-DD')]);
  }

}


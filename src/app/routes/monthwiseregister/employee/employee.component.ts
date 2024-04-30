import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { CalendarDayInfo, MonthlyData, EmployeePunchingInfo, PunchTrace, MonthwiseEmployeeApiData, Employee } from './interface';
import { DatePipe, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { switchMap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-monthwiseregister-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [MatTableModule, DatePipe, NgIf, MatFormField, MatLabel, MatInputModule]
})

export class MonthwiseregisterEmployeeComponent implements OnInit {
  aadhaarid: string;
  date: string;
  data: MonthwiseEmployeeApiData;
  dataSource = new MatTableDataSource<EmployeePunchingInfo>();
  displayedColumns: string[] = ['day', 'punchin', 'punchout', 'duration', 'xtratime', 'info'];
  clickedRows = new Set<EmployeePunchingInfo>();
  employeeInfo: Employee | null;

  constructor(
    private route: ActivatedRoute,
    private apiService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => {
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
      });
  }

  getCellBgcolor(dateItem: any) {
    let dayColor = '';
    if (dateItem.is_holiday != '1' && !dateItem.is_future) {
      dayColor = (dateItem.punching_count <= '0') ? '#EF9A9A' : '';
      if(dateItem.punching_count =='1') {
        dayColor = '#FFE082';
      }
    }
    return dayColor;
  }

  getDateStyle(dateItem: any) {
    let dateColorSet = '';
    const dateColorDef = '';
    if (dateItem.attendance_trace_fetch_complete) {
      if (!dateItem.is_holiday && !dateItem.is_future) {
        dateColorSet = (dateItem.punching_count <= '0') ? '#EF9A9A' : '';
        if(dateItem.punching_count =='1') {
          dateColorSet = '#FFE082';
        }
      }
    }
    return {
      //     'color': holiday,
      'background-color': dateColorSet ? dateColorSet : dateColorDef,
      'font-weight': dateColorSet ? 'bold' : '',
    };
  }
  // getDateStyle(dateItem: any) {
  //   console.log("ljfl");
  //   const leave = (dateItem.punching_count = 0 && dateItem.attendance_trace_fetch_complete) ? 'yellow' : '';
  //   return {
  //     'font-weight': leave ? 'bold' : '',
  //     'color': leave?'yellow':''
  //   }
  // }

  // getHolidayStyle(dateItem: any) {
  //   const holiday = (dateItem.is_holiday == 1) ? 'red' : '';
  //   return {
  //     'color': holiday,
  //   }
  // }

}


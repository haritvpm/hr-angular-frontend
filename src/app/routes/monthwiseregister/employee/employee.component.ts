import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { CalendarDayInfo, MonthlyData, EmployeePunchingInfo, PunchTrace, MonthwiseEmployeeApiData } from './interface';
import { DatePipe, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-monthwiseregister-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [MatTableModule, DatePipe, NgIf]
})
export class MonthwiseregisterEmployeeComponent implements OnInit {
  aadhaarid: string;
  date: string;
  data: MonthwiseEmployeeApiData;
  dataSource = new MatTableDataSource<EmployeePunchingInfo>();
  displayedColumns: string[] = ['day', 'punchin', 'punchout', 'duration', 'xtratime', 'info'];
  clickedRows = new Set<EmployeePunchingInfo>();

  constructor(
    private route: ActivatedRoute,
    private apiService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.aadhaarid = params.aadhaarid;
      this.date = params.date || new Date().toISOString().slice(0, 10);
      this.loadData();
    });
  }

  loadData() {
    // Call your API service to fetch data using Aadhaar ID and date
    this.apiService.getEmployeeData(this.aadhaarid, this.date)
      .subscribe(response => {
        this.data = response;
        console.log(this.data.employee_punching);
        this.dataSource.data = this.data.employee_punching;
      });
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


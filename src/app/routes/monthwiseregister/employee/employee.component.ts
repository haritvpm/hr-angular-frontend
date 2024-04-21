import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import {CalendarDayInfo, MonthlyData, EmployeePunchingInfo, PunchTrace, MonthwiseEmployeeApiData} from './interface';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-monthwiseregister-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [MatTableModule]
})
export class MonthwiseregisterEmployeeComponent implements OnInit {
  aadhaarid: string;
  date: string;
  data: MonthwiseEmployeeApiData ;
  dataSource = new MatTableDataSource<EmployeePunchingInfo>();
  displayedColumns: string[] = ['day','aadhaarid', 'name'];


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
    });
  }

}

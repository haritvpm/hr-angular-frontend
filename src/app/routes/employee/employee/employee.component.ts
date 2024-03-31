import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-employee-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [PageHeaderComponent]
})
export class EmployeeEmployeeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

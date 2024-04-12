import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-settings-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [PageHeaderComponent]
})
export class SettingsEmployeeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

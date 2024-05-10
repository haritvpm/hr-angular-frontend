import { Component, Input } from '@angular/core';
import { MonthwiseEmployeeApiData } from '../interface';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-employee-yearly-attendance-list',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './employee-yearly-attendance-list.component.html',
  styleUrl: './employee-yearly-attendance-list.component.css'
})
export class EmployeeYearlyAttendanceListComponent {
  @Input() attendanceData : MonthwiseEmployeeApiData  | null = null;
}

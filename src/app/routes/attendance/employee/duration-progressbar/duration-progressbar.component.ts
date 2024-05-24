import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-duration-progressbar',
  standalone: true,
  imports: [MatProgressBarModule, NgIf],
  templateUrl: './duration-progressbar.component.html',
  styleUrl: './duration-progressbar.component.css'
})
export class DurationProgressbarComponent {

  @Input() punchItem: any;

  getPercentage(dateItem: any) {
    const duration = dateItem.duration_sec;
    const durationNeeded = dateItem.duration_sec_needed;
    return durationNeeded ? (duration / durationNeeded) * 100 : 0;
  }

  getDurationStyle(durationPercent: number) {
    if (durationPercent == 100)
      return 'accent';
    else
      return durationPercent < 100 ? 'warn' : 'primary';
  }

  getLeaveColor(activeStatus: string) {
    return activeStatus == 'N' ? 'DeepSkyBlue' : 'Red';
  }

  getLeaveType(leaveType: string) {
    if (leaveType === 'casual')
      return 'Casual Leave';
    else if (leaveType === 'commuted')
      return 'Commuted Leave';
    else if (leaveType === 'earned')
      return 'Earned Leave';
    else
      return '';
  }

}

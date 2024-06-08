import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { leaveList } from '@shared/components/mark-hint-drawer/leave-types';

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
    return activeStatus == 'N' ? 'DeepSkyBlue' : 'LimeGreen';
  }

  getLeaveType(leaveType: string) {
    const txt = leaveList.find((x: any) => x.value == leaveType || x.short == leaveType)?.label || null;
    if (txt) return txt;
    // if (leaveType === 'CL' || leaveType === 'casual')
    //   return 'Casual Leave';
    // else if (leaveType === 'commuted')
    //   return 'Commuted Leave';
    // else if (leaveType === 'earned')
    //   return 'Earned Leave';
    // else if (leaveType === 'compen_for_extra')
    //   return 'Compensation for Extra Hours';
    // else if (leaveType === 'compen')
    //   return 'Compensation Leave';
    // else if (leaveType === 'comp_leave')
    //   return 'Compensation Leave';
    // else if (leaveType === 'casual_fn')
    //   return 'Casual Leave Forenoon';
    // else if (leaveType === 'casual_an')
    //   return 'Casual Leave Afternoon';
    // else
    //   return '';
  }

}

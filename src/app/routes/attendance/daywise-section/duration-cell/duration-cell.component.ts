import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DailyPunching } from '../interface';
import { leaveList } from '@shared/components/mark-hint-drawer/leave-types';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-duration-cell',
  standalone: true,
  imports: [MatIconModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './duration-cell.component.html',
  styleUrl: './duration-cell.component.css'
})
export class DurationCellComponent {

  @Input() punching: DailyPunching;
  @Input() is_today: boolean;
  @Input() is_holiday: boolean;

  casual_half_text: string = '&#xbd;CL';
  casual_half_authcolor: string = 'red';
  casual_half_unauthcolor: string = 'orange';
  returned_leaveText: string = 'Returned';



  getLeaveText(row: DailyPunching) {

    if (row.hint) {
      const txt = leaveList.find((x: any) => x.value == row.hint)?.label || null;
      if (txt) return txt;
    }/* else if (row.computer_hint) {
      const txt = leaveList.find((x: any) => x.value == row.computer_hint)?.label || null;
      if(txt) return txt;
    }*/
    return '';
  }
  getTodaysStyle() {
    return {
      'color': 'black',
      'text-align': 'center',

    };

  }
  getSinglePunchingStyle() {
    if (this.punching.single_punch_regularised_by)
      return {
        color: 'black'
      };
    return {
      'color': 'orange',
      // 'font-weight': 'bold',
      'text-align': 'center',
    };

  }
  getLeaveColor() {

    if (this.punching?.leave?.active_status == 'N') {
      return 'DeepSkyBlue';
    } else if (this.punching?.leave?.active_status == 'Y') {
      return 'LimeGreen';
    }

    return 'red';
  }
  returnedleaveStyle() {
    if (this.punching.leave?.active_status === 'R')
      return {
        'color': 'red',
        'font-size': 'medium',
        'font-weight':'bold'

      };
      return '';

  }



}

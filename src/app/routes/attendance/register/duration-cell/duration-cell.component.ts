import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DailyPunching } from '../interface';
import { leaveList } from '@shared/components/mark-hint-drawer/leave-types';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-duration-cell',
  standalone: true,
  imports: [MatIconModule,NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './duration-cell.component.html',
  styleUrl: './duration-cell.component.css'
})
export class DurationCellComponent {

  @Input() punching: DailyPunching;
  @Input() is_today: boolean;
  @Input() is_holiday: boolean;



  getLeaveText(row: DailyPunching) {

    if (row.hint) {
      return leaveList.find((x: any) => x.value == row.hint)?.label || '';
    }


  }
  getTodaysStyle() {
    return {
      'color': 'black',
      'text-align': 'center',

    };

  }
  getSinglePunchingStyle() {
    if (this.punching.hint && this.punching.finalized_by_controller)
      return {
        color: 'black'
      };
    return {
      'color': 'orange',
      'font-weight': 'bold',
      'text-align': 'center',
      'font-size': 'large'

    };

  }





}

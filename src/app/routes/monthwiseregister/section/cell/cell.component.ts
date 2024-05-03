import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PunchingInfo, MonthlyPunching, MonthlyApiData } from './../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { leaveList } from '@shared/components/mark-hint-drawer/leave-types';



@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './cell.component.css'
})
export class CellComponent implements OnInit {
  @Input() item: PunchingInfo;
  @Input() calendarInfo: any;
  // @Input() isSectionOfficer: boolean;
  // @Input() isController: boolean;


  casual_fn: boolean = false;
  casual_an: boolean = false;
  casual: boolean = false;
  casual_color: string = 'red';

  fetch_pending: boolean = false;
  icon_color: string = 'primary';
  icon_name: string = '';
  icon_show: boolean = true;
  time_exceeded_an: boolean = false;
  time_exceeded_fn: boolean = false;
  grace_exceeded300_and_today_has_grace_alarm_show: boolean = true;

  text_name: string = '';
  text_color: string = 'DeepPink';

  ngOnInit() {

    this.grace_exceeded300_and_today_has_grace_alarm_show =
          this.item.grace_exceeded300_and_today_has_grace ;

    this.fetch_pending = !this.calendarInfo.future_date &&
      !this.calendarInfo.attendance_trace_fetch_complete;

    if (this.item) {
      //hints
      if (this.item.hint) { //dont use computer_hint if real hint set by SO exists
        //under has marked hint
        if (this.item.finalized_by_controller) {
          this.grace_exceeded300_and_today_has_grace_alarm_show = false;
          //this can be set after leave submitted
         // this.text_color = 'DeepSkyBlue';
        //  this.casual_color = 'DeepSkyBlue';
        }

        this.casual_fn = this.item.hint === 'casual_fn';
        this.casual_an = this.item.hint === 'casual_an';
      } else {
        //computer hints
        this.casual = this.item.computer_hint === 'casual';
        if (this.item.grace_total_exceeded_one_hour > 1800) {
          this.casual_fn = this.item.computer_hint === 'casual_fn';
          this.casual_an = this.item.computer_hint === 'casual_an';
        } else {
          // this.time_exceeded_fn = this.item.computer_hint === 'casual_fn';
          //  this.time_exceeded_an = this.item.computer_hint === 'casual_an';
        }
      }

      //icon to show
      if (this.item.punching_count >= 2) {

        this.icon_color = this.item.grace_sec > 3600 ? 'OrangeRed' // '#880E4F'
        : this.grace_exceeded300_and_today_has_grace_alarm_show ? 'DeepPink'  : 'gray';

        this.icon_name = this.item.punching_count == 2 ? 'looks_two' :
          this.item.punching_count == 3 ? 'looks_3' :
            this.item.punching_count == 4 ? 'looks_4' :
              this.item.punching_count == 5 ? 'looks_5' : 'looks_6';
      }
      else if (this.item.punching_count === 1) {
        this.icon_name = 'looks_one';
        this.icon_color = !this.calendarInfo.is_today ? 'orange' : 'black';
        if (this.item.finalized_by_controller) {
          this.icon_color = 'black';
        }
      } else if (!this.calendarInfo.holiday && !this.calendarInfo.is_today) {
        //zero punching

          if (!this.calendarInfo.future_date) {
            this.icon_name = 'close';
            this.icon_color = 'DeepPink'; //'#6017ff';
          }
      }

      if (this.item.hint && this.item.hint !== 'clear') {
        this.icon_show = this.item.punching_count !=0 ; //if zero punching then no need to show icon since there is hint
        //^^^^ show icon if hint is set like casual. because it will be missed if not shown and leave added
        if(!this.casual_fn && !this.casual_an){ //we show 1/2 cl text if casual_fn or casual_an is set
         this.text_name = leaveList.find((x:any) => x.value == this.item.hint)?.short || 'X';
        }
      }

      // @if (item.grace_sec > 3600 ) {
      //   <span style="color: #FF1744;" > <mat-icon>alarm</mat-icon></span>
      // }
    }

  }
}

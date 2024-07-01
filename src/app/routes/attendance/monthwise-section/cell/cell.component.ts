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
  casual_text: string = 'CL';
  casual_half_text: string = '&#xbd;CL';
  casual_color: string = 'red';

  fetch_pending: boolean = false;
  icon_color: string = 'primary';
  icon_name: string = '';
  icon_show: boolean = true;
  time_exceeded_an: boolean = false;
  time_exceeded_fn: boolean = false;
  grace_exceeded300_and_today_has_grace_alarm_show: boolean = true;
  isUnauthorised: boolean = false;

  text_name: string = '';
  text_color: string = 'DeepPink';
  showDash: boolean = false;

  ngOnInit() {

    this.grace_exceeded300_and_today_has_grace_alarm_show =
          this.item.grace_exceeded300_and_today_has_grace ;

    this.fetch_pending = !this.calendarInfo.future_date &&
      !this.calendarInfo.attendance_trace_fetch_complete;



    if (this.item) {
      this.showDash = !this.calendarInfo.holiday && !this.calendarInfo.future_date && (!this.item.in_section || !this.item.designation);

      //hints
      if (this.item.hint && !this.item.leave) { //dont use computer_hint if real hint set by SO exists
        //under has marked hint
        if (this.item.finalized_by_controller) {
          this.grace_exceeded300_and_today_has_grace_alarm_show = false;
          //this can be set after leave submitted
         // this.text_color = 'DeepSkyBlue';
        //  this.casual_color = 'DeepSkyBlue';
        }
        this.casual = this.item.hint === 'casual';
        this.casual_fn = this.item.hint === 'casual_fn';
        this.casual_an = this.item.hint === 'casual_an';
      } else  if (this.item.computer_hint && !this.item.leave) {
        //computer hints
        this.casual_color = 'orange';
        this.casual_half_text += '?';
        this.casual_text += '?';
        this.casual = this.item.computer_hint === 'casual';
        if (this.item.grace_total_exceeded_one_hour > 1800) {
          this.casual_fn = this.item.computer_hint === 'casual_fn';
          this.casual_an = this.item.computer_hint === 'casual_an';
        } else if(this.item.grace_total_exceeded_one_hour){
          this.time_exceeded_fn = this.item.computer_hint === 'casual_fn';
          this.time_exceeded_an = this.item.computer_hint === 'casual_an';
        }
      }

      //icon to show
      if (this.item.punching_count >= 2) {

        // this.icon_color = this.item.grace_sec > 3600 ? 'OrangeRed'
        // : this.grace_exceeded300_and_today_has_grace_alarm_show ? 'DeepPink'  : 'gray';

        this.icon_color = this.grace_exceeded300_and_today_has_grace_alarm_show ? 'OrangeRed'  : 'gray';

        this.icon_name = 'check_circle_outline';

        if( !this.calendarInfo.holiday && !this.calendarInfo.future_date && this.item.is_unauthorised ){
          this.isUnauthorised = true;

          this.icon_show = false;
         }
      }
      else if (this.item.punching_count === 1) {
        this.icon_name = 'looks_one';
        this.icon_color = !this.calendarInfo.is_today ? 'OrangeRed' : 'black';
        if (this.item.single_punch_regularised_by) {
          this.icon_color = 'black';
        }
      } else if (!this.calendarInfo.holiday && !this.calendarInfo.future_date ) {
        //zero punching yesterday
         if( this.item.is_unauthorised || this.calendarInfo.attendance_trace_fetch_complete ){
          this.icon_name = 'close';
          this.icon_color = 'DeepPink'; //'#6017ff';
         }

      }

      //special case of single punchin set by controller
      if (this.item.single_punch_type) {
        this.icon_name = 'looks_one';
        this.icon_color = 'orange' ;
        if (this.item.single_punch_regularised_by) {
          this.icon_color = 'black';
        }
      }

      if (this.item.leave ) {

        const leave = this.item.leave;

        if(leave?.active_status == 'N' || leave?.active_status == 'Y'){

          if(leave?.active_status == 'N'){
            this.text_color = 'DeepSkyBlue';
            this.casual_color = 'DeepSkyBlue';
          } else if(leave?.active_status == 'Y'){
            this.text_color = 'LimeGreen';
            this.casual_color = 'LimeGreen';
          }

          this.icon_show = this.item.punching_count >= 1; //even if half cl, show icon
          if( leave.leave_type == 'CL' || leave.leave_type == 'casual'){
            if(  leave.leave_cat == 'F'){
              //this.text_name = 'CL';
              this.casual = true;
            } else {
                if( leave.time_period?.toUpperCase() == 'FN'){
                  this.casual_fn = true;
                } else {
                  this.casual_an = true;
                }
            }
          } else {
            this.text_name = leaveList.find((x:any) => x.value == leave.leave_type || x.short == leave.leave_type)?.short || 'X';
          }
        }

      }

      if (this.item.hint && this.item.hint !== 'clear'  ) {
        this.icon_show = this.icon_show && this.item.punching_count > 0  ; //if zero punching then no need to show icon since there is hint
        //^^^^ show icon if hint is set like casual. because it will be missed if not shown and leave added
        if(!this.casual && !this.casual_fn && !this.casual_an ){ //we show 1/2 cl text if casual_fn or casual_an is set
         this.text_name = leaveList.find((x:any) => x.value == this.item.hint)?.short || 'X';
        }
      }
    }

  }
}

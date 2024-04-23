import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PunchingInfo, MonthlyPunching, MonthlyApiData } from './../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

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
  casual_fn: boolean = false;
  casual_an: boolean = false;
  casual: boolean = false;
  fetch_pending: boolean = false;
  icon_color: string = 'primary';
  icon_name: string = '';
  time_exceeded_an : boolean = false;
  time_exceeded_fn : boolean = false;
  ngOnInit() {
    this.fetch_pending = !this.calendarInfo.future_date && !this.calendarInfo.attendance_trace_fetch_complete;

    if (this.item) {
      //hints
      if(this.item.hint){ //dont use computer_hint if real hint set by SO exists
        this.casual = this.item.hint === 'casual';
        this.casual_fn = this.item.hint === 'casual_fn';
        this.casual_an = this.item.hint === 'casual_an';
      } else {
        this.casual = this.item.computer_hint === 'casual';
        if( this.item.grace_total_exceeded_one_hour > 1800 ){
          this.casual_fn = this.item.computer_hint === 'casual_fn';
          this.casual_an = this.item.computer_hint === 'casual_an';
        } else {
         // this.time_exceeded_fn = this.item.computer_hint === 'casual_fn';
        //  this.time_exceeded_an = this.item.computer_hint === 'casual_an';
        }
      }

      //icon to show
        if (this.item.punching_count >= 2) {
          this.icon_color = this.item.grace_sec > 3600 ? '#FF1744' : 'gray';
          this.icon_name = this.item.punching_count == 2 ? 'looks_two' :
            this.item.punching_count == 3 ? 'looks_3' :
              this.item.punching_count == 4 ? 'looks_4' :
                this.item.punching_count == 5 ? 'looks_5' : 'looks_6';
        }
        else if (this.item.punching_count === 1) {
          this.icon_name = 'looks_one';
          this.icon_color = !this.calendarInfo.is_today ? 'orange' : 'black';
        } else if (!this.calendarInfo.holiday && !this.calendarInfo.is_today) {
          //zero punching
          if (!this.calendarInfo.future_date/* && !this.item.hint*/) {
            this.icon_name = 'close';
            this.icon_color = '#6017ff';
          }
        }
      
      // @if (item.grace_sec > 3600 ) {
      //   <span style="color: #FF1744;" > <mat-icon>alarm</mat-icon></span>
      // }
    }

  }
}

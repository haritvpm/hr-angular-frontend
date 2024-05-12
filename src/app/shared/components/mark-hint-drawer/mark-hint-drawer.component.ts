import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { MTX_DRAWER_DATA, MtxDrawerRef } from '@ng-matero/extensions/drawer';
import moment from 'moment';
import { leaveList } from './leave-types';
import { Leave } from 'app/routes/monthwiseregister/employee/interface';

@Component({
  selector: 'app-mark-hint-drawer',
  standalone: true,
  imports: [
    MatRadioModule,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatButton,
    CommonModule,
    MatDividerModule,
  ],
  templateUrl: './mark-hint-drawer.component.html',
  styleUrl: './mark-hint-drawer.component.css',
})
export class MarkHintDrawerComponent implements OnInit {
  constructor(
    public drawerRef: MtxDrawerRef<MarkHintDrawerComponent>,
    @Inject(MTX_DRAWER_DATA) public data: any
  ) {}

  leaveList: any[] = leaveList;
  selected: string = '';
  canMarkLeave: boolean = false;
  selectedLabel: string = '';
  submittedLeaveLabel: string = '';
  remarks: string = '';
  punchingTimes: string = '';
  leave: Leave | null = null;

  ngOnInit() {
    console.log(this.data);
    this.selected = this.data.punchingInfo.hint || this.data.punchingInfo.computer_hint;

    this.remarks = this.data.punchingInfo.remarks || '';
    this.selectedLabel =
      this.leaveList.find((x: any) => x.value == this.data.punchingInfo.hint)?.desc || '';
    if (this.data.punchingInfo.punching_count) {
      this.punchingTimes = `${this.data.punchingInfo.in_time || '?'} - ${this.data.punchingInfo.out_time || '?'}`;
    } else if (!this.data.punchingInfo.is_today) {
      this.punchingTimes = '';
    }
//for monthwise view, logged_in_user_is_controller is present in monthlyPunching
// for employee view, logged_in_user_is_controller is present in punchingInfo
    const logged_in_user_is_controller = this.data.monthlyPunching.logged_in_user_is_controller ||
    this.data.punchingInfo.logged_in_user_is_controller;
    const logged_in_user_is_so = this.data.monthlyPunching.logged_in_user_is_section_officer ||
    this.data.punchingInfo.logged_in_user_is_section_officer;

    if (
      logged_in_user_is_controller||
      (logged_in_user_is_so && !this.data.punchingInfo.finalized_by_controller)
    ) {
      this.canMarkLeave = true;
    }

    if (this.data.punchingInfo.leave) {
      if (
        this.data.punchingInfo.leave.active_status == 'N' ||
        this.data.punchingInfo.leave.active_status == 'Y'
      ) {
        this.leave = this.data.punchingInfo.leave;
        let leave_type = this.leave?.leave_type;
        if (leave_type == 'CL') {
          if (this.leave?.leave_cat == 'F') {
            leave_type = 'CL';
          } else {
            leave_type = this.leave?.time_period == 'FN' ? 'C_FN' : 'C_AN';
          }
        }
        this.submittedLeaveLabel =
          this.leaveList.find((x: any) => x.short == leave_type)?.label || leave_type;

         // hint changes only when it becomes Y. so no need to change it again bu SO
        if (this.leave?.active_status == 'Y') {
          this.canMarkLeave = false;
        }
      }
    }
  }

  onNoClick(): void {
    this.drawerRef.dismiss();
  }

  onOkClick() {
    //save the selected value

    this.drawerRef.dismiss({ hint: this.selected, remarks: this.remarks });
  }

  getDateExceeded300() {
    return moment(this.data.monthlyPunching.total_grace_exceeded300_date).format('MMM DD');
  }

  getLeaveColor() {
    if (this.leave?.active_status == 'N') {
      return 'DeepSkyBlue';
    } else if (this.leave?.active_status == 'Y') {
      return 'LimeGreen';
    }

    return 'red';
  }

  canShowOption(option: any) {
    if (
      this.data.punchingInfo.punching_count < option.min_pun ||
      (this.data.calender.holiday && !option.showOnHoliday) ||
      (option.showForCntrlOnly && !this.data.monthlyPunching.logged_in_user_is_controller)
    ) {
      return false;
    }

    const cls = Math.max(
      this.data.monthlyPunching.cl_marked,
      this.data.monthlyPunching.cl_submitted
    );
    if (option.value == 'casual' && cls > 19) return false; //if 19.5, not allowed
    if ((option.value == 'casual_an' || option.value == 'casual_fn') && cls >= 20) return false;

    const compens = Math.max(
      this.data.monthlyPunching.compen_marked,
      this.data.monthlyPunching.compen_submitted
    );
    if (option.value == 'comp_leave' && compens >= 15) return false;

    if (option.value == 'restricted' && !this.data.calender.rh) return false;

    if(this.data.calender.office_ends_at == '3pm' && (option.value == 'casual_an' )) return false;
    if(this.data.calender.office_ends_at == 'noon' && (option.value == 'casual_an' || option.value == 'casual_fn')) return false;

    if(this.data.punchingInfo.time_group == 'parttime' && (option.value == 'casual_an' || option.value == 'casual_fn')) return false;

    return true;
  }
}

import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormsModule, UntypedFormControl } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { MTX_DRAWER_DATA, MtxDrawerRef } from '@ng-matero/extensions/drawer';
import moment from 'moment';
import { leaveList } from './leave-types';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { Leave } from 'app/routes/attendance/employee/interface';
import { NgxPermissionsModule } from 'ngx-permissions';
import {
  MtxDatetimepicker,
  MtxDatetimepickerInput,
  MtxDatetimepickerMode,
  MtxDatetimepickerToggle,
  MtxDatetimepickerType,
} from '@ng-matero/extensions/datetimepicker';

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
    MatCheckboxModule,
    NgxPermissionsModule,
    MtxDatetimepicker,
    MtxDatetimepickerInput,
    MtxDatetimepickerToggle,
    MatSuffix,
  ],
  templateUrl: './mark-hint-drawer.component.html',
  styleUrl: './mark-hint-drawer.component.css',
})
export class MarkHintDrawerComponent implements OnInit {
  constructor(
    public drawerRef: MtxDrawerRef<MarkHintDrawerComponent>,
    @Inject(MTX_DRAWER_DATA) public data: any
  ) {}

  private readonly toast = inject(ToastrService);

  leaveList: any[] = leaveList;
  selected: string = '';
  canMarkLeave: boolean = false;
  selectedLabel: string = '';
  submittedLeaveLabel: string = '';
  remarks: string = '';
  punchingTimes: string = '';
  leave: Leave | null = null;

  canMarkSinglePunch: boolean = false;
  single_punch_type: string = '';
  isSinglePunch: boolean = false;
  regulariseSinglePunch: boolean = false;
  canRegulariseSinglePunch: boolean = false;

  // type: MtxDatetimepickerType = 'datetime';
  // mode: MtxDatetimepickerMode = 'auto';
  // startView: MtxCalendarView = 'month';
  multiYearSelector = false;
  touchUi = false;
  twelvehour = false;
  timeInterval = 1;
  timeInput = true;
  datetime = moment(this.data.punchingInfo.date).format('YYYY-MM-DDTHH:mm:ss');


  ngOnInit() {
    console.log(this.data);

    //if this.data.punchingInfo.controller_set_punch_out is present, then modify time. else use default time
    if(this.data.punchingInfo.single_punch_type == 'in' && this.data.punchingInfo.controller_set_punch_out){
      this.datetime = moment(this.data.punchingInfo.controller_set_punch_out).format('YYYY-MM-DDTHH:mm:ss');
    } else if(this.data.punchingInfo.single_punch_type == 'out' && this.data.punchingInfo.controller_set_punch_in){
      this.datetime = moment(this.data.punchingInfo.controller_set_punch_in).format('YYYY-MM-DDTHH:mm:ss');
    }

    this.selected = this.data.punchingInfo.hint || this.data.punchingInfo.computer_hint;

    if(this.data.punchingInfo.is_unauthorised){
      this.selected = 'unauthorised';
    }

    this.single_punch_type = this.data.punchingInfo.single_punch_type || '';
    if(this.single_punch_type || this.data.punchingInfo.punching_count===1){
      this.isSinglePunch = true;
    }
    this.regulariseSinglePunch = this.data.punchingInfo.single_punch_regularised_by ? true : false;

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
    const logged_in_user_is_controller = this.data.monthlyPunching?.logged_in_user_is_controller ||
        this.data.punchingInfo.logged_in_user_is_controller;
    const logged_in_user_is_so = this.data.monthlyPunching?.logged_in_user_is_section_officer ||
       this.data.punchingInfo.logged_in_user_is_section_officer;
    const logged_in_user_is_superior = this.data.monthlyPunching?.logged_in_user_is_superior_officer ||
        this.data.punchingInfo.logged_in_user_is_superior_officer;

    if (
      logged_in_user_is_controller ||
      (logged_in_user_is_so && !this.data.punchingInfo.finalized_by_controller)
    ) {
      this.canMarkLeave = true;
    }
    if( this.data.punchingInfo.single_punch_regularised_by == null && logged_in_user_is_superior ) {
      this.canMarkSinglePunch = !this.data.calender.is_today && !this.data.calender.future_date &&
                (this.data.punchingInfo.punching_count == 1 || //can be singlepunch if they punch twice within minutes at evening
                (this.data.punchingInfo?.single_punch_type && this.data.punchingInfo?.single_punch_type !== null //&& this.data.punchingInfo.single_punch_regularised_by == null

                ));
    }

    if(logged_in_user_is_superior &&
      !this.data.punchingInfo.single_punch_regularised_by
    /*&& this.single_punch_type*/){
      this.canRegulariseSinglePunch = true;
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
          this.leaveList.find((x: any) => x.value == leave_type || x.short == leave_type)?.desc || leave_type;

         // hint changes only when it becomes Y. so no need to change it again bu SO
        if (this.leave?.active_status == 'Y') {
          this.canMarkLeave = false;
        }
      }
    } else if(this.data.punchingInfo.is_unauthorised){
      this.selectedLabel = 'Unauthorised';
    }
  }

  onNoClick(): void {
    this.drawerRef.dismiss();
  }

  onOkClick() {
    //save the selected value
    // this.toast.info(this.selected);

    //check if everything is selected.
    // if (this.canMarkLeave && !this.selected  ) {
    //   this.toast.error('Please select a leave type');
    //   return;
    // }

    if ((this.isSinglePunch|| this.regulariseSinglePunch) && this.single_punch_type == '') {
      this.toast.error('Please select a single punch type');
      return;
    }

    this.drawerRef.dismiss(
      { hint: this.selected,
        remarks: this.remarks,
        isSinglePunch: this.isSinglePunch,
        single_punch_type: this.single_punch_type,
        regulariseSinglePunch: this.regulariseSinglePunch,
        missingDateTime: moment(this.datetime).format('YYYY-MM-DD HH:mm:ss'),
        });
  }

  onSinglePunchChange() {
    if(!this.isSinglePunch || this.single_punch_type == null){
      this.regulariseSinglePunch = false;
    }

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
      (option.showForCntrlOnly && !this.data.monthlyPunching?.logged_in_user_is_controller)
    ) {
      return false;
    }

    const startWithCl = this.data.yearlyPunching.start_with_cl || 0;
    const startWithCompen = this.data.yearlyPunching.start_with_compen || 0;

    const cls = Math.max(
      this.data.monthlyPunching.cl_marked,
      this.data.monthlyPunching.cl_submitted
    ) + startWithCl;

    if (option.value == 'casual' && cls > 19) return false; //if 19.5, not allowed
    if ((option.value == 'casual_an' || option.value == 'casual_fn') && cls >= 20) return false;

    const compens = Math.max(
      this.data.monthlyPunching.compen_marked,
      this.data.monthlyPunching.compen_submitted
    ) + startWithCompen;

    if (option.value == 'comp_leave' && compens >= 15) return false;

    if (option.value == 'restricted' && !this.data.calender.rh) return false;

    if(this.data.calender.office_ends_at == '3pm' && (option.value == 'casual_an' )) return false;
    if(this.data.calender.office_ends_at == 'noon' && (option.value == 'casual_an' || option.value == 'casual_fn')) return false;

    if(this.data.punchingInfo.time_group == 'parttime' && (option.value == 'casual_an' || option.value == 'casual_fn')) return false;

    return true;
  }
}

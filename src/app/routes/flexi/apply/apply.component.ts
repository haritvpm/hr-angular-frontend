import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MtxAlertModule } from '@ng-matero/extensions/alert';
import { TimeOption, canChangeFlexiFunc, getTimeOptionStringFromFlexiMinute, getTimeOptions } from '@shared/util_funcs';
import { EmployeePostingService } from 'app/routes/settings/employee-posting/employee-posting.service';
import { UserFlexiSettingApi } from 'app/routes/settings/employee-posting/interfaces';
import moment from 'moment';
import { finalize, map } from 'rxjs';
import { FlexiService } from '../flexi.service';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-apply-flexi',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, MatButtonModule,
    FormsModule, MatFormFieldModule, MatSelectModule, MatIconModule,
    MatInputModule, MatDatepickerModule,
    MtxAlertModule],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.css',
  //providers: [provideNativeDateAdapter()],

})
export class FlexiApplyComponent implements OnInit {

  data: UserFlexiSettingApi;
  canChangeFlexi = false;
  tomorrow = new Date();
  lastChangedtext = 'never';
  timeOptions: TimeOption[] = [];
  isSubmitting = false;
  upcommingFlexiTime: string = '';
  initial = false;
  allowable_wef_dates: string[] = [];

  applyFlexiForm = new FormGroup({
    flexi_minutes: new FormControl(null, Validators.required),
    wef: new FormControl('', [Validators.required,]),
    forwardto: new FormControl(0, [Validators.required,]),
    time_option_str: new FormControl('', []),
    time_option_current_str: new FormControl('', []),

  });
  constructor(
    private flexiService: FlexiService,
    private router: Router,
    private route: ActivatedRoute,

  ) {
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }



  ngOnInit() {

    this.route.data
      .pipe(
        map(data => data.emp_setting),
      )
      .subscribe(response => {
        console.log(response);
        this.data = response as UserFlexiSettingApi;
        //set default forwardto
        this.applyFlexiForm.patchValue({
          forwardto: this.data.forwardable_seats.length? this.data.forwardable_seats[0].seat_id : null,
          time_option_current_str: getTimeOptionStringFromFlexiMinute(
            this.data.employee_setting.flexi_minutes_current,
            this.data.employee_setting.time_group, this.data.officeTimes),
        });

        if (this.data.employee_setting.flexi_minutes_upcoming) {
          this.upcommingFlexiTime = getTimeOptionStringFromFlexiMinute(
            this.data.employee_setting.flexi_minutes_upcoming,
            this.data.employee_setting.time_group, this.data.officeTimes);
        }

        const { initial, canChangeFlexi, lastChangedtext, dates } = this.getFlexiDates(

          this.data.employee_setting.flexi_time_wef_current, this.data.employee_setting.flexi_time_wef_upcoming,);

          this.lastChangedtext = lastChangedtext;
          this.initial = initial;
          this.allowable_wef_dates = dates;
          this.canChangeFlexi = canChangeFlexi;

          if(initial){
            this.applyFlexiForm.patchValue({
              wef: moment(this.tomorrow).format('YYYY-MM-DD'),
            }, {emitEvent: true});
          } else {
            this.applyFlexiForm.patchValue({
              wef: dates[0],
            }, {emitEvent: true});
          }

          this.updateTimeOptions(this.applyFlexiForm.get('wef')!.value);


      });

    // console.log(this.data);

    this.applyFlexiForm.get('wef')!.valueChanges.subscribe(wef => {
      this.updateTimeOptions(wef);
    });



    // if (this.data.employee_setting.flexi_time_wef_upcoming) {

    //   this.applyFlexiForm.patchValue({
    //     flexi_minutes: this.data.employee_setting.flexi_minutes_upcoming,
    //     wef: this.data.employee_setting.flexi_time_wef_upcoming,
    //   });
    // }
    // else


    //flexi can be changed if flexi_time_last_updated is not this month OR IF flexi_time_last_updated is null.
    //if there is an upcoming change, do not allow change
    /*
    const { canChangeFlexi, lastChangedtext } = canChangeFlexiFunc(
      this.data.employee_setting.flexi_time_wef_upcoming ?
      this.data.employee_setting.flexi_time_wef_upcoming :
      this.data.employee_setting.flexi_time_wef_current);

    this.lastChangedtext = lastChangedtext;
    this.canChangeFlexi = canChangeFlexi;
    */



  }

  updateTimeOptions(wef: string | null) {
    this.timeOptions = getTimeOptions(wef, this.data.employee_setting.flexi_minutes_current,
    this.data.employee_setting.time_group, this.data.officeTimes);
  }

  myAllowableDaysFilter = (d: Date | null): boolean => {

    //console.log(d);

    if(!d){
      return false;
    }
    //console.log(d, this.tomorrow);
    if(this.initial){
     // console.log(d, this.tomorrow);
     //return if d is tomorrow or later
    //  return d >= this.tomorrow;
    const isSameOrAfter = moment(d).isSameOrAfter(this.tomorrow , 'day');
    return isSameOrAfter;
    }

    //get d as string'
    const time = moment(d).format('YYYY-MM-DD');


    return !!this.allowable_wef_dates.find(x=>x==time);

  };

  getFlexiDates(flexi_time_wef_current: string|null, flexi_time_wef_upcoming: string|null)
  : {initial: boolean, canChangeFlexi: boolean, lastChangedtext: string, dates: string[]} {
    //flexi can be changed if flexi_time has not yet been changed.
    //other wise can change with effect from next month 1st
    let initial = false;
    let lastChangedtext = 'never';
    const dates: string[] = [];
    let canChangeFlexi = true;

    const today = moment();

    if(flexi_time_wef_current || flexi_time_wef_upcoming){

      //if there is an upcoming change, do not allow change
      if(flexi_time_wef_upcoming){
        canChangeFlexi = false;
        const lastUpdated = moment(flexi_time_wef_upcoming);
        lastChangedtext = lastUpdated.format('DD MMM YYYY');

      } else {

          const lastUpdated = moment(flexi_time_wef_current);
          lastChangedtext = lastUpdated.format('DD MMM YYYY');

          //get list of upcoming month 1st date of next 6 months
          //get next month 1st date
          const nextMonth = today.clone().add(1, 'months').startOf('month');
          dates.push(nextMonth.format('YYYY-MM-DD'));
      }

    }else{
      initial = true;
    }

    return {initial, canChangeFlexi, lastChangedtext, dates};

  }


  cancel() {
    throw new Error('Method not implemented.');
  }
  applyFlexi() {
    const formdata = this.applyFlexiForm.value;

    if (this.applyFlexiForm.invalid || formdata.flexi_minutes===null) {
      return;
    }
    this.isSubmitting = true;

    const timeOption = this.timeOptions.find(to => to.value === formdata.flexi_minutes!);
    const time_option_str = timeOption ? timeOption.label : '';

    this.applyFlexiForm.controls.time_option_str.setValue(time_option_str);

    //add time option label to formdata
    formdata.time_option_str = timeOption ? timeOption.label : '';

    this.flexiService.saveUserFlexiSetting(formdata)
      // .pipe(
      //   finalize(() => this.isSubmitting = false)
      // )
      .subscribe((res: any) => {
        this.router.navigate(['/flexi/view']);
      }).add(() => {
        this.isSubmitting = false;
      });
  }

}

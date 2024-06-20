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

@Component({
  selector: 'app-apply-flexi',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, MatButtonModule,
    FormsModule, MatFormFieldModule, MatSelectModule, MatIconModule,
    MatInputModule, MatDatepickerModule,
    MtxAlertModule],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.css'
})
export class FlexiApplyComponent implements OnInit {

  data: UserFlexiSettingApi;
  canChangeFlexi = false;
  tomorrow = new Date();
  lastChangedtext = 'never';
  timeOptions: TimeOption[] = [];
  isSubmitting = false;
  upcommingFlexiTime: string = '';

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
    this.tomorrow.setDate(moment().add(1, 'days').date());
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


      });

    // console.log(this.data);

    this.applyFlexiForm.get('wef')!.valueChanges.subscribe(wef => {
      this.timeOptions = getTimeOptions(wef, this.data.employee_setting.flexi_minutes_current,
        this.data.employee_setting.time_group, this.data.officeTimes);
    });



    // if (this.data.employee_setting.flexi_time_wef_upcoming) {

    //   this.applyFlexiForm.patchValue({
    //     flexi_minutes: this.data.employee_setting.flexi_minutes_upcoming,
    //     wef: this.data.employee_setting.flexi_time_wef_upcoming,
    //   });
    // }
    // else
    {
      this.applyFlexiForm.patchValue({
        wef: moment(this.tomorrow).format('YYYY-MM-DD'),
      });
    }

    //flexi can be changed if flexi_time_last_updated is not this month OR IF flexi_time_last_updated is null.
    //if there is an upcoming change, do not allow change
    const { canChangeFlexi, lastChangedtext } = canChangeFlexiFunc(
      this.data.employee_setting.flexi_time_wef_upcoming ?
      this.data.employee_setting.flexi_time_wef_upcoming :
      this.data.employee_setting.flexi_time_wef_current);

    this.lastChangedtext = lastChangedtext;
    this.canChangeFlexi = canChangeFlexi;

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
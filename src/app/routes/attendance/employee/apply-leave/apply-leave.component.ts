/* eslint-disable max-len */
import { JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMultipleDatesModule } from 'ngx-multiple-dates';
import { MtxAlertModule } from '@ng-matero/extensions/alert';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { GovtCalendar } from '../interface';
import moment from 'moment';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, MatButtonModule,
    FormsModule, MatFormFieldModule, MatSelectModule, MatIconModule,
    MatInputModule, MatDatepickerModule, MatDatepickerModule, NgxMultipleDatesModule,
    MtxAlertModule],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css'
})
export class ApplyLeaveComponent implements OnInit, OnDestroy {
  //leaveCount: number = 0;

  // holidaysInLast3MonthsOfSelectedDate: Date[] = [
  //   new Date('1966-01-26'),
  //   new Date('2024-01-01'),
  //   new Date('2024-01-26'),

  // ];
  private subscriptions: Subscription[] = [];

  readonly casualTypes = [{ value: 'full', label: 'Full Day' }, { value: 'fn', label: 'Forenoon' }, { value: 'an', label: 'Afternoon' }];
  sameDate: boolean = false;
  casualFromTypes = this.casualTypes;
  casualToTypes = this.casualTypes;
  errorMessage: string[] = [];
  compenMinDate = new Date('2024-01-01');
  compenMaxDate = new Date();
  today = new Date();
  casualMinDate = new Date('2024-01-01');
  casualPeriodHidden = true;
  showingPeriod = false;
  isCasualOrCompen = false;
  isSubmitting = false;
  fromDateMax = moment().add(1, 'year').toDate();
  applyLeaveForm = this.fb.group({
    leaveType: ['', Validators.required],
    fromDate: ['', Validators.required],
    fromType: [''],
    toDate: [''],
    toType: [{ value: 'full', disabled: true },], //disable this to start with
    reason: ['', Validators.required],
    inLieofDates: [''],
    inLieofMonth: [''],
    leaveCount: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0.5)]],
  });

  readonly leaveapplyTypes = [
    { value: 'casual', label: 'Casual Leave' },
    { value: 'compen', label: 'Compensation Leave' },
    { value: 'compen_for_extra', label: 'Compensation Leave (for extra hours worked)' },
    { value: 'commuted', label: 'Commuted Leave' },
    { value: 'earned', label: 'Earned Leave' },
    { value: 'halfpay', label: 'Half Pay Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'other', label: 'Other' },

  ];

  inLieofMonths : { value: string, label: string }[] = [];

  allholidays: string[] = [];
  holidaysInPeriod: string[] = [];

  constructor(
    private fb: FormBuilder,
    private empService: EmployeeService,
    private router: Router
  ) { }



  ngOnInit() {

    this.empService.getHolidays().subscribe((value) => {
      this.allholidays = value.holidays.map(g => g.date);
    }
    );

    this.subscriptions.push(this.applyLeaveForm.get('fromDate')!.valueChanges
      .subscribe((value) => {
        this.onFromDateChange(value);
      }));

    this.subscriptions.push(this.applyLeaveForm.get('toDate')!.valueChanges
      .subscribe((value) => {
        this.onToDateChange(value);
      }));

    this.subscriptions.push(this.applyLeaveForm.valueChanges
      .subscribe((value) => {
        this.onFormChange(value);
      }));

    this.subscriptions.push(this.applyLeaveForm.get('leaveType')!.valueChanges.subscribe(val => {
      this.onLeaveTypeChange(val);
    }));
  }

  onLeaveTypeChange(leaveType: any) {

    this.applyLeaveForm.controls.toType.clearValidators();


    if (leaveType === 'compen') {
      this.applyLeaveForm.controls.inLieofDates.setValidators([Validators.required]);
      this.applyLeaveForm.controls.leaveCount.setValidators([Validators.max(15), Validators.min(1), Validators.required]);
    } else {
      this.applyLeaveForm.controls.inLieofDates.clearValidators();
    }

    if (leaveType === 'casual') {
      this.applyLeaveForm.get('fromType')?.enable({ emitEvent: false });
      this.applyLeaveForm.controls.fromType.setValidators([Validators.required]);
      this.applyLeaveForm.controls.leaveCount.setValidators([Validators.max(15), Validators.min(0.5), Validators.required]);

    } else {
      this.applyLeaveForm.get('fromType')?.disable({ emitEvent: false });
      this.applyLeaveForm.controls.fromType.clearValidators();
    }

    if (leaveType !== 'compen' && leaveType !== 'casual' && leaveType !== 'compen_for_extra') {
      this.applyLeaveForm.controls.toDate.setValidators([Validators.required]);
      this.applyLeaveForm.controls.leaveCount.setValidators([Validators.min(1), Validators.required]);
    } else {
      this.applyLeaveForm.controls.toDate.clearValidators();
    }

    if (leaveType === 'compen_for_extra') {
     this.casualPeriodHidden = true;
     this.showingPeriod = false;
     this.applyLeaveForm.controls.inLieofMonth.setValidators([Validators.required]);
    } else{
      this.applyLeaveForm.controls.inLieofMonth.clearValidators();
    }

    if(leaveType === 'compen' || leaveType === 'compen_for_extra'){
      this.fromDateMax = moment().add(3, 'months').toDate(); //cant take leave for date not yet worked
    } else {
      this.fromDateMax = moment().add(1, 'year').toDate();
    }

    this.showingPeriod = ['casual', 'compen', 'compen_for_extra',''].indexOf(this.applyLeaveForm.get('leaveType')?.value || '') === -1 || !this.casualPeriodHidden;

    this.isCasualOrCompen = ['compen', 'casual','compen_for_extra'].indexOf(this.applyLeaveForm.get('leaveType')?.value || '') != -1;
    //reset dateto and totype to empty
    this.applyLeaveForm.get('toDate')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
    this.applyLeaveForm.get('toType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
    this.applyLeaveForm.get('fromType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop

    this.applyLeaveForm.controls.inLieofDates.updateValueAndValidity();
    this.applyLeaveForm.controls.leaveCount.updateValueAndValidity();
    this.applyLeaveForm.controls.toDate.updateValueAndValidity();
    this.applyLeaveForm.controls.fromType.updateValueAndValidity();
    this.applyLeaveForm.controls.toType.updateValueAndValidity();
    this.applyLeaveForm.controls.inLieofMonth.updateValueAndValidity();

  }
  showPeriod() {
    this.casualPeriodHidden = false;
    this.showingPeriod = true;
  }

  enumerateDaysBetweenDates(startDate: any, endDate: any) {
    const dates: string[] = [];
    while (moment(startDate) <= moment(endDate)) {
      dates.push(startDate);
      startDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
    }
    // while(startDate <= endDate){
    //   dates.push(startDate);
    //   startDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
    // }
    return dates;
  }
  checkholiday(leaveType: string, fromDate: any, toDate: any) {

    if (fromDate) {
      const date = moment(fromDate).format('YYYY-MM-DD');
      if (this.allholidays.indexOf(date) !== -1) {
        this.errorMessage.push('Selected \'From\' date is a holiday');
      }
    }

    if (toDate) {
      const date = moment(toDate).format('YYYY-MM-DD');
      if (this.allholidays.indexOf(date) !== -1) {
        this.errorMessage.push('Selected \'To\' date is a holiday');
      }
    }

    if (this.isCasualOrCompen) {
      if (this.holidaysInPeriod.length > 0) {
        this.errorMessage.push('Selected period has holidays. ');
      }
    }

  }
  onFormChange(form: any) {
    this.errorMessage = [];
    this.holidaysInPeriod = [];
    let leave = 0;
    //count days from start date to end date if both are not empty
    const fromDate = form.fromDate;
    const toDate = form.toDate;
    console.log('onFormChange' + fromDate);

    if (fromDate && toDate) {
      const dates = this.enumerateDaysBetweenDates(fromDate, toDate);
      leave = dates.length;
      // if( form.leaveType == 'casual' ||  form.leaveType == 'compen' ) {
      this.holidaysInPeriod = dates.filter(d => this.allholidays.indexOf(d) !== -1);
      //   leave -= this.holidaysInPeriod.length;
      // }

      if (form.leaveType == 'casual') {
        if (form.fromType == '' || form.toType == '') {
          // this.errorMessage.push('Please select from and to types');
          leave = 0;
        }

      }

    } else if (fromDate && !toDate) {
      const date = moment(fromDate).format('YYYY-MM-DD');
      console.log('onFormChange' + date);
      console.log(this.allholidays);

      if (this.allholidays.indexOf(date) == -1) {
        leave = 1;
      } else {
        leave = 0;
      }

      if (form.leaveType !== 'casual' && form.leaveType !== 'compen' && form.leaveType !== 'compen_for_extra') leave = 0;

    }
    this.checkholiday(form.leaveType, fromDate, toDate);
    //now for casual.
    if (form.leaveType == 'casual') {
      if (1 == leave) {
        leave = (form.fromType == 'an' || form.fromType == 'fn') ? 0.5 : form.fromType == 'full' ? 1 : 0;

      } else {

        if (form.fromType && form.toType) {

          if (form.fromType == 'an') {
            leave -= 0.5;
          }
          if (form.toType == 'fn') {
            leave -= 0.5;
          }
        }

      }

    }
    if (form.leaveType == '') leave = 0;

    this.applyLeaveForm.get('leaveCount')?.setValue(leave, { emitEvent: false }); //emitEvent: false to avoid infinite loop



  }
  onFromDateChange(fromDate: any) {

    const toDate = this.applyLeaveForm.get('toDate')?.value;
    const leaveType = this.applyLeaveForm.get('leaveType')?.value;
    //const fromType = this.applyLeaveForm.get('fromType')?.value || null;
    this.applyLeaveForm.get('toDate')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
    this.applyLeaveForm.get('toType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
    this.applyLeaveForm.get('fromType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
    this.casualFromTypes = this.casualTypes;
    this.casualToTypes = this.casualTypes;

    this.sameDate = false;

    if (fromDate && toDate &&
      (fromDate.toString() === toDate.toString())) {
      console.log('fromDate and toDate are same');
      // this.sameDate = true;
      // if (leaveType === 'casual') {
      //   //reset toTypes if ot was cchanged by date change .see below else block
      //   this.casualFromTypes = this.casualTypes;
      //   this.casualToTypes = this.casualTypes;
      //   this.applyLeaveForm.get('toType')?.setValue(fromType, { emitEvent: false }); //emitEvent: false to avoid infinite loop
      // }


    } else {
      console.log('fromDate and toDate are different');
      //this.sameDate = false;
    }
    this.casualAnFnSync(leaveType, fromDate, toDate);

    //update minimum date for compen
    this.compenMinDate = moment(fromDate).subtract(3, 'months').toDate();
    this.compenMaxDate = moment(fromDate).subtract(1, 'day').toDate();
    this.casualMinDate = moment(fromDate).add(1, 'day').toDate();
    //find the last 3 months of month of fromDate
    this.inLieofMonths = [];
    for (let i = 1; i <= 3; i++) {
      const date = moment(fromDate).subtract(i, 'months');
      this.inLieofMonths.push({ value: date.format('YYYY-MM-DD'), label: date.format('MMMM YYYY') });
    }

  }
  clearEndDate() {
    this.applyLeaveForm.get('toDate')?.setValue(''); //emitEvent: false to avoid infinite loop

  }
  onToDateChange(toDate: any) {
    const fromDate = this.applyLeaveForm.get('fromDate')?.value;
    const fromType = this.applyLeaveForm.get('fromType')?.value || null;
    const leaveType = this.applyLeaveForm.get('leaveType')?.value;

    if (fromDate && toDate && (fromDate.toString() === toDate.toString())) {

      console.log('fromDate == toDate');
      this.sameDate = true;

      if (leaveType === 'casual') {
        this.applyLeaveForm.get('toType')?.setValue(fromType, { emitEvent: false }); //emitEvent: false to avoid infinite loop
      }

    } else {
      console.log('fromDate <> toDate ');
      this.sameDate = false;

      if (leaveType === 'casual') {
        this.applyLeaveForm.get('toType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop

      }
    }

    this.casualAnFnSync(leaveType, fromDate, toDate);

    if ( leaveType !== 'casual' ||  this.sameDate || !(this.applyLeaveForm.get('toDate')?.value)) {
      this.applyLeaveForm.get('toType')?.disable({ emitEvent: false });
      this.applyLeaveForm.controls.toType.clearValidators();

    } else {
      this.applyLeaveForm.get('toType')?.enable({ emitEvent: false });
      this.applyLeaveForm.controls.toType.setValidators([Validators.required]);
    }

    this.applyLeaveForm.controls.toType.updateValueAndValidity();


  }

  applyLeave() {

    if (this.applyLeaveForm.invalid) {
      return;
    }
    const isCasual = this.applyLeaveForm.value.leaveType === 'casual';
    console.log(this.applyLeaveForm.value);

    //if casual or compen make sure there are no holidays in the period
    this.errorMessage = [];

    // if( this.isCasualOrCompen ){
    //   if( this.holidaysInPeriod.length > 0 ){
    //     this.errorMessage.push('Selected period has holidays. ');
    //     return;
    //   }
    // }


    //compensation make sure the count of dates are correct.

    //cant exceed now because we prevent holidays in period
    // if( this.isCasualOrCompen ){
    //   const count = this.applyLeaveForm.value.leaveCount || 0;
    //   if( count > 15 || count < 1 ){
    //     this.errorMessage.push('Leave days should be between 1 and 15 days');
    //     return;
    //   }
    // }

    this.isSubmitting = true;

    this.empService.applyLeave(this.applyLeaveForm.value).subscribe(
      {
        next: (v) =>
          {console.log(v);
          this.isSubmitting = false;
          this.applyLeaveForm.reset();

          },
        error: (e) => {console.error(e); this.isSubmitting = false;},
        complete: () => {console.info('complete'); this.isSubmitting = false;}
      });


  }

  casualAnFnSync(leaveType: any, fromDate: any, toDate: any) {
    //if (leaveType === 'casual')
    {
      this.casualToTypes = this.casualTypes;

      if (!this.sameDate && fromDate && toDate) { //only if toDate is set
        this.casualFromTypes = this.casualTypes.filter(x => x.value != 'fn'); //[{ value: 'full', label: 'Full Day' }, { value: 'an', label: 'Afternoon' }];
        this.casualToTypes = this.casualTypes.filter(x => x.value != 'an'); //[{ value: 'full', label: 'Full Day' }, { value: 'fn', label: 'Forenoon' }];
      } else {
        this.applyLeaveForm.get('toType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
        this.applyLeaveForm.get('fromType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop

        this.casualFromTypes = this.casualTypes;
        this.casualToTypes = this.casualTypes;
      }  //value.leaveType === 'casual' e
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  cancel() {
    this.router.navigateByUrl('/attendance/self');
  }

}

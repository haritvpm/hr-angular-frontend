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

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, MatButtonModule,
    FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatDatepickerModule, MatDatepickerModule, NgxMultipleDatesModule,
    MtxAlertModule],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css'
})
export class ApplyLeaveComponent implements OnInit, OnDestroy {
  leaveCount: number = 0;

  // holidaysInLast3MonthsOfSelectedDate: Date[] = [
  //   new Date('1966-01-26'),
  //   new Date('2024-01-01'),
  //   new Date('2024-01-26'),

  // ];
  private subscriptions : Subscription[] = [];

  readonly casualTypes = [{ value: 'full', label: 'Full Day' }, { value: 'fn', label: 'Forenoon' }, { value: 'an', label: 'Afternoon' }];
  sameDate : boolean = false;
  casualFromTypes = this.casualTypes;
  casualToTypes = this.casualTypes;
  errorMessage :string = '';

  applyLeaveForm = this.fb.group({
    leaveType: ['', Validators.required],
    fromDate: ['', Validators.required],
    fromType: [''],
    toDate: [''],
    toType: [{ value: '', disabled: true }, ], //disable this to start with
    reason: ['', Validators.required],
    inLieofDates: [''],

  });

  readonly leaveapplyTypes = [
    { value: 'casual', label: 'Casual Leave' },
    { value: 'compen', label: 'Compensation Leave' },
    { value: 'commuted', label: 'Commuted Leave' },
    { value: 'earned', label: 'Earned Leave' },
    { value: 'halfpay', label: 'Half Pay Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'other', label: 'Other' },

  ];

  holidays : string[] = [];

  constructor(private fb: FormBuilder,
    private empService: EmployeeService
    ) { }

  // compenValidator(form: FormGroup): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const needRequire = form.get('leaveType')?.value == 'compen';
  //     const noValue = needRequire ? !(control.value) : false;
  //     return noValue ? {required: control.value} : null;

  //   };
  // }

  ngOnInit() {
    // this.applyLeaveForm.get('inLieofDates')?.setValidators(this.compenValidator(this.applyLeaveForm));

    // this.applyLeaveForm.get('leaveType')?.valueChanges
    // .pipe(takeUntilDestroyed())
    // .subscribe(() => {
    //   this.applyLeaveForm.get('inLieofDates')?.updateValueAndValidity();

    // });
    this.empService.getHolidays().subscribe( (value) =>
      {
        this.holidays = value.map(g => g.date);
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
  }
   enumerateDaysBetweenDates (startDate:any, endDate:any){
    const dates : string[] = [];
    while(moment(startDate) <= moment(endDate)){
      dates.push(startDate);
      startDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
    }
    // while(startDate <= endDate){
    //   dates.push(startDate);
    //   startDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
    // }
    return dates;
  }

  onFormChange ( form: any ){
    //console.log(form);
    this.leaveCount = 0;
    let leave = 0;
    //count days from start date to end date if both are not empty
    const fromDate = form.fromDate;
    const toDate = form.toDate;
    console.log( 'onFormChange' + fromDate );

    if( fromDate && toDate ){
      const dates = this.enumerateDaysBetweenDates(fromDate, toDate);
      if( form.leaveType == 'casual' ||  form.leaveType !== 'compen' ) {
      const datesWithoutHolidays = dates.filter( d => this.holidays.indexOf( d ) == -1);
      leave = datesWithoutHolidays.length;
      } else {
        leave = dates.length;
      }

    } else if( fromDate && !toDate ){
      const date = fromDate;
      if(this.holidays.indexOf( date ) == -1) leave = 1;

      if( form.leaveType !== 'casual' &&  form.leaveType !== 'compen' ) leave =0;

    }

    //now for casual.
    if( form.leaveType == 'casual' ){
      if( 1 == leave ){
        this.leaveCount = ( form.fromType == 'an' || form.fromType == 'fn' ) ? 0.5 : form.fromType == 'full' ? 1 : 0;

      } else {

        if( form.fromType && form.toType  ){

          if( form.fromType == 'an' ){
            leave -= 0.5;
          }
          if( form.toType == 'fn' ){
            leave -= 0.5;
          }

          this.leaveCount = leave;
        }

      }

    } else {
      this.leaveCount = leave;
    }

  }
  onFromDateChange( fromDate: any ){

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
    this.casualAnFnSync(leaveType, fromDate, toDate  );

  }

  onToDateChange( toDate: any ){
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

    this.casualAnFnSync(leaveType, fromDate, toDate  );

    if(this.sameDate || !(this.applyLeaveForm.get('toDate')?.value)){
      this.applyLeaveForm.get('toType')?.disable({ emitEvent: false });
    } else {
      this.applyLeaveForm.get('toType')?.enable({ emitEvent: false });
    }
  }

  applyLeave() {

    if (this.applyLeaveForm.invalid) {
      return;
    }
    const isCasual = this.applyLeaveForm.value.leaveType === 'casual';
    console.log(this.applyLeaveForm.value);


    if (this.applyLeaveForm.value.fromDate?.toString()
        !== this.applyLeaveForm.value.toDate?.toString()) {
      //diff date date from and to

      //if casual, make sure fromType and toType are present
      if (isCasual) {
        if (!this.applyLeaveForm.value.fromType || !this.applyLeaveForm.value.toType) {

          this.errorMessage = 'Select Full/AN/FN for both dates';
          return;
        }
        if (this.applyLeaveForm.value.toDate && !this.applyLeaveForm.value.toType) {
          this.errorMessage = 'Select Full/AN/FN for end date';

          return;
        }
      }
    } else {
      //same dates
      if (isCasual) {
        if (!this.applyLeaveForm.value.fromType ) {

          this.errorMessage = 'Select Full/AN/FN for start date';
          return;
        }
      }
    }

    //compensation make sure the count of dates are correct.



  }

  casualAnFnSync(leaveType:any, fromDate:any, toDate:any)
  {
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
}

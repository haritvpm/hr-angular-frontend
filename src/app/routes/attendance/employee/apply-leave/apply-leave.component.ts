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
import { Subscription, debounce, debounceTime, first, map, tap } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { GovtCalendar } from '../interface';
import moment from 'moment';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LeavesService } from 'app/routes/leaves/leaves.service';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, MatButtonModule,
    FormsModule, MatFormFieldModule, MatSelectModule, MatIconModule,
    MatInputModule, MatDatepickerModule, MatDatepickerModule, NgxMultipleDatesModule,
    MtxAlertModule, MatCheckboxModule],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css'
})
export class ApplyLeaveComponent implements OnInit, OnDestroy {
  //leave_count: number = 0;

  // holidaysInLast3MonthsOfSelectedDate: Date[] = [
  //   new Date('1966-01-26'),
  //   new Date('2024-01-01'),
  //   new Date('2024-01-26'),

  // ];
  private subscriptions: Subscription[] = [];

  readonly casualTypes = [{ value: 'full', label: 'Full Day' }, { value: 'fn', label: 'Forenoon' }, { value: 'an', label: 'Afternoon' }];
  id : number = -1;
  isAddMode = false;

  sameDate: boolean = false;
  casualFromTypes = this.casualTypes;
  casualToTypes = this.casualTypes;
  errorMessages: string[] = [];
  warningMessages: string[] = [];
  prefix_holidays: string[] = [];
  suffix_holidays: string[] = [];
  
  compenMinDate = new Date('2024-01-01');
  compenMaxDate = new Date();
  today = new Date();
  casualMinDateTo = new Date('2024-01-01');
  casualMaxDateTo = new Date('2024-01-01');
  isCasualOrCompen = false;
  isCasualOrCompenOrCompenExtra = false;
  isSubmitting = false;
  fromDateMax = moment().add(1, 'year').toDate();
  applyLeaveForm = this.fb.group({
    leave_type: ['', Validators.required],
    start_date: ['', Validators.required],
    fromType: [''],
    end_date: [''],
    // toType: [{ value: 'full', disabled: true },], //disable this to start with
    reason: ['', Validators.required],
    inLieofDates: [''],
    inLieofMonth: [''],
    leave_count: [0, [Validators.required, Validators.min(0.5)]],
    multipleDays : [false],
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
    private router: Router,
    private route: ActivatedRoute,
    private leaveService: LeavesService
  ) { }



  ngOnInit() {
    
    this.id = this.route.snapshot.params.id;
    this.isAddMode = !this.id;
    
    if (!this.isAddMode) {
      console.log('id is ' + this.id);
      this.leaveService.getById(this.id)
          .pipe(
            first(), 
            tap( x => console.log(x)),
           
            )
          
          .subscribe(x => this.applyLeaveForm.patchValue(x.data));
    }


    this.empService.getHolidays().subscribe((value) => {
      this.allholidays = value.holidays.map(g => g.date);
    });

    this.subscriptions.push(this.applyLeaveForm.get('start_date')!.valueChanges
      .subscribe((value) => {
        this.onFromDateChange(value);
      }));

    this.subscriptions.push(this.applyLeaveForm.get('end_date')!.valueChanges
      .subscribe((value) => {
        this.onToDateChange(value);
      }));

    

    this.subscriptions.push(this.applyLeaveForm.get('leave_type')!.valueChanges.subscribe(val => {
      this.onLeaveTypeChange(val);
    }));
    this.subscriptions.push(this.applyLeaveForm.get('multipleDays')!.valueChanges.subscribe(val => {
      this.onMutlipleDaysChange(val);
    }));
    
    // this.subscriptions.push(this.applyLeaveForm.get('leave_count')!.valueChanges.subscribe(val => {
    //   this.onLeaveCountChange(val);
    // }));

    this.subscriptions.push(this.applyLeaveForm.valueChanges
      .subscribe((value) => {
        this.onFormChange(value);
    }));
    
  }
  // onLeaveCountChange(leave_count: any) {
  //   this.precheckLeave();
  // }
  onLeaveTypeChange(leave_type: any) {

    // this.applyLeaveForm.controls.toType.clearValidators();
    this.isCasualOrCompenOrCompenExtra = ['compen', 'casual','compen_for_extra'].indexOf(leave_type || '') != -1;
    this.isCasualOrCompen = ['compen', 'casual'].indexOf(leave_type || '') != -1;

    if(!this.isCasualOrCompenOrCompenExtra){
      this.applyLeaveForm.get('multipleDays')?.setValue( true, { emitEvent: false });
      } else {
        this.applyLeaveForm.get('multipleDays')?.setValue( false, { emitEvent: false });
      }

    if (leave_type === 'compen') {
      this.applyLeaveForm.controls.inLieofDates.setValidators([Validators.required]);
      this.applyLeaveForm.controls.leave_count.setValidators([Validators.max(15), Validators.min(1), Validators.required]);
    } else {
      this.applyLeaveForm.controls.inLieofDates.clearValidators();
    }

    if (leave_type === 'casual' && !this.applyLeaveForm.get('multipleDays')?.value) {
      this.applyLeaveForm.get('fromType')?.enable({ emitEvent: false });
      this.applyLeaveForm.controls.fromType.setValidators([Validators.required]);
      this.applyLeaveForm.controls.leave_count.setValidators([Validators.max(15), Validators.min(0.5), Validators.required]);

    } else {
      this.applyLeaveForm.get('fromType')?.disable({ emitEvent: false });
      this.applyLeaveForm.controls.fromType.clearValidators();
    }

    if (!this.isCasualOrCompenOrCompenExtra ||(this.isCasualOrCompen && this.applyLeaveForm.get('multipleDays')?.value)) {
      this.applyLeaveForm.controls.end_date.setValidators([Validators.required]);
      this.applyLeaveForm.controls.leave_count.setValidators([Validators.min(1), Validators.required]);
    } else {
      this.applyLeaveForm.controls.end_date.clearValidators();
    }

    if (leave_type === 'compen_for_extra') {
     this.applyLeaveForm.controls.inLieofMonth.setValidators([Validators.required]);
    } else{
      this.applyLeaveForm.controls.inLieofMonth.clearValidators();
    }

    if(leave_type === 'compen' || leave_type === 'compen_for_extra'){
      this.fromDateMax = moment().add(3, 'months').toDate(); //cant take leave for date not yet worked
    } else {
      this.fromDateMax = moment().add(1, 'year').toDate();
    }

    //if(['casual', 'compen', 'compen_for_extra',''].indexOf(this.applyLeaveForm.get('leave_type')?.value || '') === -1 || !this.casualPeriodHidden;


    //reset dateto and totype to empty
    this.applyLeaveForm.get('end_date')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
    // this.applyLeaveForm.get('toType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
    this.applyLeaveForm.get('fromType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop



    this.applyLeaveForm.controls.inLieofDates.updateValueAndValidity();
    this.applyLeaveForm.controls.leave_count.updateValueAndValidity();
    this.applyLeaveForm.controls.end_date.updateValueAndValidity();
    this.applyLeaveForm.controls.fromType.updateValueAndValidity();
    // this.applyLeaveForm.controls.toType.updateValueAndValidity();
    this.applyLeaveForm.controls.inLieofMonth.updateValueAndValidity();
    //this.precheckLeave();

  }
  onMutlipleDaysChange( multiple: any ) {
   // this.applyLeaveForm.get('multipleDays')?.setValue('true'); //emitEvent: false to avoid infinite loop
   if (!multiple ) {
    this.applyLeaveForm.get('fromType')?.enable({ emitEvent: false });
    this.applyLeaveForm.controls.fromType.setValidators([Validators.required]);
    this.applyLeaveForm.controls.end_date.clearValidators();

    this.applyLeaveForm.get('end_date')?.setValue('', { emitEvent: false }); //update leave count


  } else {
    this.applyLeaveForm.get('fromType')?.disable({ emitEvent: false });
    this.applyLeaveForm.controls.fromType.clearValidators();
    this.applyLeaveForm.controls.end_date.setValidators([Validators.required]);

  }

  this.applyLeaveForm.controls.fromType.updateValueAndValidity();
  this.applyLeaveForm.controls.end_date.updateValueAndValidity();

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
  checkholiday(leave_type: string, start_date: any, end_date: any) {
/*
    if (start_date) {
      const date = moment(start_date).format('YYYY-MM-DD');
      if (this.allholidays.indexOf(date) !== -1) {
        this.errorMessages.push('Selected \'From\' date is a holiday');
      }
    }

    if (end_date) {
      const date = moment(end_date).format('YYYY-MM-DD');
      if (this.allholidays.indexOf(date) !== -1) {
        this.errorMessages.push('Selected \'To\' date is a holiday');
      }
    }

    if (this.isCasualOrCompen) {
      if (this.holidaysInPeriod.length > 0) {
        this.errorMessages.push('Selected period has holidays. ');
      }
    }
*/
  }
  onFormChange(form: any) {
    this.errorMessages = [];
    this.holidaysInPeriod = [];
    let leave = 0;
    //count days from start date to end date if both are not empty
    const start_date = form.start_date;
    const end_date = form.end_date;
    console.log('onFormChange' + start_date);

    if (start_date && end_date) {
      const dates = this.enumerateDaysBetweenDates(start_date, end_date);
      leave = dates.length;
      // if( form.leave_type == 'casual' ||  form.leave_type == 'compen' ) {
      this.holidaysInPeriod = dates.filter(d => this.allholidays.indexOf(d) !== -1);
      //   leave -= this.holidaysInPeriod.length;
      // }

      if (form.leave_type == 'casual') {
        if (form.fromType == '' || form.toType == '') {
          // this.errorMessage.push('Please select from and to types');
          leave = 0;
        }

      }

    } else if (start_date && !end_date) {
      const date = moment(start_date).format('YYYY-MM-DD');
      console.log('onFormChange' + date);
      console.log(this.allholidays);

      if (this.allholidays.indexOf(date) == -1) {
        leave = 1;
      } else {
        leave = 0;
      }

      if (form.leave_type !== 'casual' && form.leave_type !== 'compen' && form.leave_type !== 'compen_for_extra') leave = 0;

     // this.precheckLeave();
    }

    this.checkholiday(form.leave_type, start_date, end_date);
    //now for casual.
    if (form.leave_type == 'casual') {
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
    if (form.leave_type == '') leave = 0;

    this.applyLeaveForm.get('leave_count')?.setValue(leave, { emitEvent: false }); //emitEvent: false to avoid infinite loop

   // console.log('form is ' + JSON.stringify(form) );
   // console.log('form from value is ' + JSON.stringify(this.applyLeaveForm?.value));

    this.precheckLeave();
  }

  onFromDateChange(start_date: any) {

    const end_date = this.applyLeaveForm.get('end_date')?.value;
    const leave_type = this.applyLeaveForm.get('leave_type')?.value;
    //const fromType = this.applyLeaveForm.get('fromType')?.value || null;
    this.applyLeaveForm.get('end_date')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
    // this.applyLeaveForm.get('toType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
    this.applyLeaveForm.get('fromType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
    this.casualFromTypes = this.casualTypes;
    this.casualToTypes = this.casualTypes;

    this.sameDate = false;

    if (start_date && end_date &&
      (start_date.toString() === end_date.toString())) {
      console.log('start_date and end_date are same');
      // this.sameDate = true;
      // if (leave_type === 'casual') {
      //   //reset toTypes if ot was cchanged by date change .see below else block
      //   this.casualFromTypes = this.casualTypes;
      //   this.casualToTypes = this.casualTypes;
      //   this.applyLeaveForm.get('toType')?.setValue(fromType, { emitEvent: false }); //emitEvent: false to avoid infinite loop
      // }


    } else {
      console.log('start_date and end_date are different');
      //this.sameDate = false;
    }
    // this.casualAnFnSync(leave_type, start_date, end_date);

    //update minimum date for compen
    this.compenMinDate = moment(start_date).subtract(3, 'months').toDate();
    this.compenMaxDate = moment(start_date).subtract(1, 'day').toDate();
    
    this.casualMinDateTo = moment(start_date).add(1, 'day').toDate();
    this.casualMaxDateTo = moment(start_date).endOf('year').toDate();
    //find the last 3 months of month of start_date
    this.inLieofMonths = [];
    for (let i = 1; i <= 3; i++) {
      const date = moment(start_date).subtract(i, 'months');
      this.inLieofMonths.push({ value: date.format('YYYY-MM-01'), label: date.format('MMMM YYYY') });
    }
   // this.precheckLeave();
   
  }

  precheckLeave(){
    this.empService.precheckLeave( this.applyLeaveForm.value )
    .pipe(
      debounceTime(50),
    ).subscribe( res => {
      this.errorMessages = res.errors;
      this.warningMessages = res.warnings;
      this.prefix_holidays = res.prefix_holidays;
      this.suffix_holidays = res.suffix_holidays;
      
    }

    );
  }

  clearEndDate() {
    this.applyLeaveForm.get('end_date')?.setValue(''); //emitEvent: false to avoid infinite loop

  }
  onToDateChange(end_date: any) {
    const start_date = this.applyLeaveForm.get('start_date')?.value;
    const fromType = this.applyLeaveForm.get('fromType')?.value || null;
    const leave_type = this.applyLeaveForm.get('leave_type')?.value;

    if (start_date && end_date && (start_date.toString() === end_date.toString())) {

      console.log('start_date == end_date');
      this.sameDate = true;

      if (leave_type === 'casual') {
        // this.applyLeaveForm.get('toType')?.setValue(fromType, { emitEvent: false }); //emitEvent: false to avoid infinite loop
      }

    } else {
      console.log('start_date <> end_date ');
      this.sameDate = false;

      if (leave_type === 'casual') {
        // this.applyLeaveForm.get('toType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop

      }
    }

    // this.casualAnFnSync(leave_type, start_date, end_date);

    // if ( leave_type !== 'casual' ||  this.sameDate || !(this.applyLeaveForm.get('end_date')?.value)) {
    //   this.applyLeaveForm.get('toType')?.disable({ emitEvent: false });
    //   this.applyLeaveForm.controls.toType.clearValidators();

    // } else {
    //   this.applyLeaveForm.get('toType')?.enable({ emitEvent: false });
    //   this.applyLeaveForm.controls.toType.setValidators([Validators.required]);
    // }
    // this.applyLeaveForm.controls.toType.updateValueAndValidity();

    //this.precheckLeave();


  }

  applyLeave() {

    if (this.applyLeaveForm.invalid) {
      return;
    }
    const isCasual = this.applyLeaveForm.value.leave_type === 'casual';
    console.log(this.applyLeaveForm.value);

    //if casual or compen make sure there are no holidays in the period
    this.errorMessages = [];
    this.warningMessages = [];

    // if( this.isCasualOrCompen ){
    //   if( this.holidaysInPeriod.length > 0 ){
    //     this.errorMessage.push('Selected period has holidays. ');
    //     return;
    //   }
    // }


    //compensation make sure the count of dates are correct.

    //cant exceed now because we prevent holidays in period
    // if( this.isCasualOrCompen ){
    //   const count = this.applyLeaveForm.value.leave_count || 0;
    //   if( count > 15 || count < 1 ){
    //     this.errorMessage.push('Leave days should be between 1 and 15 days');
    //     return;
    //   }
    // }

  //   if (this.isAddMode) {
  //     this.createUser();
  // } else {
  //     this.updateUser();
  // }

    this.isSubmitting = true;

    if( this.isAddMode ){
      this.empService.applyLeave(this.applyLeaveForm.value).subscribe(
      {
        next: (v) =>
          {console.log(v);
          this.isSubmitting = false;
          this.cancel();

          },
        error: (e) => {console.error(e); this.isSubmitting = false;},
        complete: () => {console.info('complete'); this.isSubmitting = false;}
      });
    } else {
      this.empService.updateLeave( this.id, this.applyLeaveForm.value).subscribe(
        {
          next: (v) =>
            {console.log(v);
            this.isSubmitting = false;
            this.cancel();
  
            },
          error: (e) => {console.error(e); this.isSubmitting = false;},
          complete: () => {console.info('complete'); this.isSubmitting = false;}
        });
    }

  }

  // casualAnFnSync(leave_type: any, start_date: any, end_date: any) {
  //   //if (leave_type === 'casual')
  //   {
  //     this.casualToTypes = this.casualTypes;

  //     if (!this.sameDate && start_date && end_date) { //only if end_date is set
  //       this.casualFromTypes = this.casualTypes.filter(x => x.value != 'fn'); //[{ value: 'full', label: 'Full Day' }, { value: 'an', label: 'Afternoon' }];
  //       this.casualToTypes = this.casualTypes.filter(x => x.value != 'an'); //[{ value: 'full', label: 'Full Day' }, { value: 'fn', label: 'Forenoon' }];
  //     } else {
  //       // this.applyLeaveForm.get('toType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop
  //       this.applyLeaveForm.get('fromType')?.setValue('', { emitEvent: false }); //emitEvent: false to avoid infinite loop

  //       this.casualFromTypes = this.casualTypes;
  //       this.casualToTypes = this.casualTypes;
  //     }  //value.leave_type === 'casual' e
  //   }
  // }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  cancel() {
    this.applyLeaveForm.reset();
    this.router.navigateByUrl('/attendance/self');
  }

}

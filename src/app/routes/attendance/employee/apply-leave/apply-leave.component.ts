import { JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMultipleDatesModule } from 'ngx-multiple-dates';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule,
    MatButtonModule, FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatDatepickerModule, MatDatepickerModule,
    NgxMultipleDatesModule],
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

  constructor(private fb: FormBuilder) { }

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

    this.subscriptions.push(this.applyLeaveForm.get('fromDate')!.valueChanges
      .subscribe((value) => {
        this.onFromDateChange(value);
      }));
    
    this.subscriptions.push(this.applyLeaveForm.get('toDate')!.valueChanges
      .subscribe((value) => {
        this.onToDateChange(value);
      }));


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

    console.log(this.applyLeaveForm.value);

    if (this.applyLeaveForm.value?.toDate &&
      this.applyLeaveForm.value.fromDate! > this.applyLeaveForm.value.toDate) {
      return;
    }

    if (this.applyLeaveForm.value.fromDate?.toString() 
        === this.applyLeaveForm.value.toDate?.toString()) {
      //same date from and to

      //if casual, make sure fromType and toType are same
      if (this.applyLeaveForm.value.leaveType === 'casual') {
        if (this.applyLeaveForm.value.fromType !== this.applyLeaveForm.value.toType) {

          return;
        }

      }

    }

    if (this.applyLeaveForm.value.leaveType === 'casual') {
      if (!this.applyLeaveForm.value.fromType) {
        return;
      }

      if (this.applyLeaveForm.value.toDate && !this.applyLeaveForm.value.toType) {
        return;
      }
    }
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

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

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, MatButtonModule,
    FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatDatepickerModule, MatDatepickerModule, NgxMultipleDatesModule],
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
  fromDateSubscription: any = null;
  readonly casualTypes = [{ value: 'full', label: 'Full Day' }, { value: 'fn', label: 'Forenoon' }, { value: 'an', label: 'Afternoon' }];

  casualFromTypes = this.casualTypes;
  casualToTypes = this.casualTypes;

  applyLeaveForm = this.fb.group({
    leaveType: ['', Validators.required],
    fromDate: ['', Validators.required],
    fromType: ['full'],
    toDate: [''],
    toType: ['full'],
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

    this.fromDateSubscription = this.applyLeaveForm.valueChanges
      .subscribe((value) => {
        console.log('form valueChanges' + JSON.stringify(value));

        if (value.fromDate && value.toDate &&
          (value.fromDate.toString() === value.toDate.toString())) {
          console.log('fromDate and toDate are same');

          if (value.leaveType === 'casual') {
            //reset toTypes if ot was cchanged by date change .see below else block
            this.casualFromTypes = this.casualTypes;
            this.casualToTypes = this.casualTypes;
            this.applyLeaveForm.get('toType')?.setValue(value.fromType!, { emitEvent: false }); //emitEvent: false to avoid infinite loop
          }


        } else {
          console.log('fromDate and toDate are different');

          if (value.leaveType === 'casual') {
            this.casualToTypes = this.casualTypes;

            if (value.fromDate && value.toDate) { //only if toDate is set
              this.casualFromTypes = this.casualTypes.filter(x => x.value != 'fn'); //[{ value: 'full', label: 'Full Day' }, { value: 'an', label: 'Afternoon' }];
              this.casualToTypes = this.casualTypes.filter(x => x.value != 'an'); //[{ value: 'full', label: 'Full Day' }, { value: 'fn', label: 'Forenoon' }];
            } else {
              this.casualFromTypes = this.casualTypes;
              this.casualToTypes = this.casualTypes;
            }  //value.leaveType === 'casual' e
          }

        }

      }); //end of subscription

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

    if (this.applyLeaveForm.value.fromDate === this.applyLeaveForm.value.toDate) {
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

  ngOnDestroy() {
    this.fromDateSubscription?.unsubscribe();
  }
}

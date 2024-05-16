import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    MatInputModule,MatDatepickerModule, MatDatepickerModule,NgxMultipleDatesModule ],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css'
})
export class ApplyLeaveComponent implements OnInit{
  leaveCount: number = 0;

  // holidaysInLast3MonthsOfSelectedDate: Date[] = [
  //   new Date('1966-01-26'),
  //   new Date('2024-01-01'),
  //   new Date('2024-01-26'),

  // ];

  applyLeaveForm = this.fb.group({
    leaveType: ['', Validators.required],
    fromDate: ['',Validators.required],
    fromType: ['full'],
    toDate: ['',Validators.required],
    toType: ['full'],
    reason: ['',Validators.required],
    inLieofDates: [''],

  });

  leaveapplyTypes = [
    {value: 'casual', label: 'Casual Leave'},
    {value: 'compen', label: 'Compensation Leave'},
    {value: 'commuted', label: 'Commuted Leave'},
    {value: 'earned', label: 'Earned Leave'},
    {value: 'halfpay', label: 'Half Pay Leave'},
    {value: 'maternity', label: 'Maternity Leave'},
    {value: 'paternity', label: 'Paternity Leave'},
    {value: 'other', label: 'Other'},

  ];

  constructor( private fb: FormBuilder  ) { }

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

  }
  applyLeave(){
    console.log(this.applyLeaveForm.value);
  }
}

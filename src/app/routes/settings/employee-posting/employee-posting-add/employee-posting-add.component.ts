import { Component, Inject, OnInit, Input  } from '@angular/core';

import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe,JsonPipe  } from '@angular/common';
import { AttendanceBook, Employee, Section } from '../interfaces';
import { Observable, map } from 'rxjs';
import { MtxSelect } from '@ng-matero/extensions/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonLoading } from '@ng-matero/extensions/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-posting-add',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatFormField,
    MatInput,
    FormsModule,
    MatButton, MatButtonLoading ,
    AsyncPipe,
    MatLabel, MtxSelect, MatHint, MatCardModule
    ],
  templateUrl: './employee-posting-add.component.html',
  styleUrl: './employee-posting-add.component.css'
})
export class EmployeePostingAddComponent  implements OnInit {

  start_date: string = '';
  today = new Date();
  freeEmployees$!: Observable<Employee[]>;
  attendancebooks: AttendanceBook[]  = [];
  sections: Section[]  = [];

  constructor(
    //private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location
  ) {
    const state:any = location.getState();
    if (state) {
      this.attendancebooks= state.attendancebooks;
      this.sections= state.sections;
    }
  }

  isSubmitting = false;

  postingForm = this.fb.nonNullable.group({
    section: ['', [Validators.required]],
    selemployee: ['', [Validators.required]],
    startdate: ['', [Validators.required]],
    attendanceBook: [''],

    rememberMe: [false],
  });


  ngOnInit() {
    this.freeEmployees$ = this.activatedRoute.data.pipe(map(data => data.unpostedEmployees));
  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`${type}: ${event.value}`);
    if (event.value) {
      this.start_date  = moment(event.value).format('YYYY-MM-DD');
    }
  }
  addPosting() {
    throw new Error('Method not implemented.');
    }
}

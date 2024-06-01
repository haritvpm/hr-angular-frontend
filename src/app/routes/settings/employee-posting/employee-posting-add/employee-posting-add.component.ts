import { Component, Inject, OnInit, Input, ViewChild } from '@angular/core';

import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { AttendanceBook, Employee, Section } from '../interfaces';
import { Observable, catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, tap } from 'rxjs';
import { MtxSelect } from '@ng-matero/extensions/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonLoading } from '@ng-matero/extensions/button';
import { Location } from '@angular/common';
import { EmployeePostingService } from '../employee-posting.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-posting-add',
  standalone: true,
  imports: [
    MatDatepickerModule, MatAutocompleteModule,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatFormField,
    MatInput,
    FormsModule, MatButtonModule,
    MatButton, MatButtonLoading,
    AsyncPipe, JsonPipe,
    MatLabel, MtxSelect, MatHint, MatCardModule, MatIconModule
  ],
  templateUrl: './employee-posting-add.component.html',
  styleUrl: './employee-posting-add.component.css'
})
export class EmployeePostingAddComponent implements OnInit {





  today = new Date();
  min_startdate = new Date();

  //freeEmployees$!: Observable<Employee[]>;
  freeemployees$!: Observable<Employee[]>;
  attendancebooks: AttendanceBook[] = [];
  sections: Section[] = [];
  @ViewChild('inputAutoComplete') inputAutoComplete: any;

  constructor(
    //private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private employeeService: EmployeePostingService
  ) {
    const state: any = location.getState();
    if (state) {
      this.sections = state.sections;
    }
  }

  isSubmitting = false;
  isLoading = false;
  postingForm = this.fb.nonNullable.group({
    employee: ['', [Validators.required]],
    section_id: ['', [Validators.required]],
  //  employee_id: ['', [Validators.required]],
    start_date: ['', [Validators.required]],
    attendance_book_id: [''],
  });


  ngOnInit() {
  //  this.freeEmployees$ = this.activatedRoute.data.pipe(map(data => data.unpostedEmployees));


    this.freeemployees$ = this.postingForm.get('employee')!.valueChanges.pipe(
      debounceTime(400),

      distinctUntilChanged(),
      filter((value) => value.length > 2),
      tap(() => this.isLoading = true),
      switchMap((value) => this.employeeService.getFreeEmployeesAjax(value)
        .pipe(

          finalize(() => this.isLoading = false),
        ))
    );

  }
  clearEmployee() {
    //evt.stopPropagation();
    this.postingForm.get('employee')!.setValue('');
      this.inputAutoComplete?.nativeElement.focus();

    }

  displayFn(employee: Employee): string {
    console.log(employee);
    return employee && employee.name ? `${employee.name}` : '';
    //return employee && employee.name ? `${employee.aadhaarid}-${employee.name} (${employee.designation})` : '';
  }
  dateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`${type}: ${event.value}`);
    if (event.value) {
      //this.start_date = moment(event.value).format('YYYY-MM-DD');
    }
  }
  addPosting() {
    this.isSubmitting = true;
    const formValue = this.postingForm.value;
    formValue.start_date = moment(formValue.start_date).format('YYYY-MM-DD');
    this.employeeService.saveEmployee(formValue)
      .pipe(catchError((error) => {
        this.isSubmitting = false;
        console.log(error);
        return error;
      }))
      .subscribe(
        (data) => {
          console.log(data);
          this.isSubmitting = false;
          this.location.back();
        });
  }

  employeeChange($event: any) {
    const employee = $event;
    console.log(employee);

    if (employee?.last_posting_end_date != '') {
      // console.log(employee.last_posting_end_date);

      const min_startdate = new Date(employee.last_posting_end_date);
      min_startdate.setDate(min_startdate.getDate() + 1);
      this.min_startdate = new Date(min_startdate);
      // console.log(this.min_startdate.toDateString());
    } else {
      this.min_startdate = new Date('2024-01-01');
    }
  }

  sectionChange($event: any) {
    const section = $event;
    this.attendancebooks = section.section_attendance_books;
  }

}

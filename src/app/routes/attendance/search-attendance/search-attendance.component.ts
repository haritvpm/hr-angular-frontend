import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { SearchAttendanceService } from './search-attendance.service';
@Component({
  selector: 'app-search-attendance',
  standalone: true,
  // providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './search-attendance.component.html',
  styleUrl: './search-attendance.component.css'
})
export class SearchAttendanceComponent implements OnInit {
  form = new FormGroup({
    range: new FormGroup({
      start: new FormControl<Date | null>(null, Validators.required),
      end: new FormControl<Date | null>(null, Validators.required),
    }),
    aadhaarid: new FormControl<string>(''),
    single_punches: new FormControl<boolean>(false),
    one_hour_exceeded: new FormControl<boolean>(false),
    grace_exceeded: new FormControl<boolean>(false),
    unauthorized: new FormControl<boolean>(false),
  });

  atleastOneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const single_punches = control.get('single_punches');
    const one_hour_exceeded = control.get('one_hour_exceeded');
    const grace_exceeded = control.get('grace_exceeded');
    const unauthorized = control.get('unauthorized');
    if (single_punches && one_hour_exceeded && !single_punches.value && !one_hour_exceeded.value &&
      grace_exceeded && unauthorized && !grace_exceeded.value && !unauthorized.value) {
      return {
        altleastonecriteria: true
      }
    }
    return null;
  }

  constructor(private searchAttendanceService: SearchAttendanceService) { }

  ngOnInit(): void {
    this.form.setValidators(this.atleastOneValidator);
  }

  onSubmit() {
    console.log(this.form.value);
    this.searchAttendanceService.search(this.form.value).subscribe((res) => {
      console.log(res);
    });

  }
}

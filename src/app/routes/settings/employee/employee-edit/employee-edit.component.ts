import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  providers: [provideNativeDateAdapter()],

  imports: [
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent {
  constructor(
    public dialogRef: MatDialogRef<EmployeeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  today = new Date(); 
  end_date: string = '';
  onNoClick(): void {
    this.dialogRef.close();
  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`${type}: ${event.value}`);
    if (event.value) {
      this.end_date  = moment(event.value).format('YYYY-MM-DD');
    }
  }

}

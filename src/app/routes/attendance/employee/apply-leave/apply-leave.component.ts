import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, MatButtonModule,
    FormsModule, MatFormFieldModule, MatSelectModule, 
    MatInputModule,MatDatepickerModule],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css'
})
export class ApplyLeaveComponent implements OnInit{
  leaveCount: number = 0;
  applyLeaveForm = this.fb.group({
    leaveType: ['', Validators.required],
    fromDate: ['',Validators.required],
    fromType: [''],
    toDate: ['',Validators.required],
    toType: [''],
    reason: ['',Validators.required]
  });
  
  leaveapplyTypes = [
    {value: 'casual', label: 'Casual Leave'},
    {value: 'maternity', label: 'Maternity Leave'},
    {value: 'paternity', label: 'Paternity Leave'},
    {value: 'compen', label: 'Compensation Leave'},
    {value: 'commuted', label: 'Commuted Leave'}
  ];

  constructor( private fb: FormBuilder  ) { }

  ngOnInit() {
  }
  applyLeave(){
    console.log(this.applyLeaveForm.value);
  }
}

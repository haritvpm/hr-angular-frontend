import { Component, Inject, OnInit } from '@angular/core';
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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  // providers: [provideNativeDateAdapter()],

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
    MatDialogClose, MatSelectModule, ReactiveFormsModule ],
  templateUrl: './employee-posting-edit.component.html',
  styleUrl: './employee-posting-edit.component.css'
})
export class EmployeePostingEditComponent implements OnInit{


  canChangeFlexi = false;
  tomorrow = new Date();
  lastChangedtext = 'never';
  timeOptions : { value:number, label : string }[] = [];

  form = new FormGroup({
    flexi_minutes: new FormControl(0, Validators.required),
    wef: new FormControl('', [
      Validators.required,

    ]),

  });

  constructor(
    public dialogRef: MatDialogRef<EmployeePostingEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tomorrow.setDate( moment().add(1, 'days').date() );
  }

  ngOnInit() {

    console.log(this.data);

    this.form.get('wef')!.valueChanges.subscribe(x => {
      this.timeOptions = [];

      if(x){
        const selected = moment(x);
        //find timegroup that is effective for the selected date
        for(let i = 0; i < this.data.officeTimes.length; i++){
          if(this.data.officeTimes[i].groupname == this.data.emp.time_group){

            const difference =  moment(this.data.officeTimes[i].with_effect_from).diff( selected, 'days' ); // returns difference in seconds
//alert(difference);
            if( difference <= 0 ){

              const flexi = this.data.officeTimes[i].flexi_minutes;
              const from = moment( '2024-01-01 '+ this.data.officeTimes[i].fn_from); //parttime does not have an_from
              //remove seconds from 'from' and 'to'
              let to = this.data.officeTimes[i].an_to || this.data.officeTimes[i].fn_to; //parttime does not have an_to
              to = moment('2024-01-01 '+ to);

              this.timeOptions.push( { value: 0, label: 'Normal (' + from.format('h:mm a') + ' - ' + to .format('h:mm a') + ')'});
              this.timeOptions.push( { value: -flexi, label: 'Flexi (' + from.add(-flexi,'minute').format('h:mm a') + ' - ' + to.add(-flexi,'minute').format('h:mm a') + ')'});
              this.timeOptions.push( { value: flexi, label: 'Flexi (' + from.add(flexi*2,'minute').format('h:mm a') + ' - ' + to.add(flexi*2,'minute').format('h:mm a') + ')'});

              break;
            }
          }

        }

      }
   });



    if(this.data.emp.flexi_time_wef_upcoming){

      this.form.patchValue({
        flexi_minutes:  this.data.emp.flexi_minutes_upcoming,
        wef: this.data.emp.flexi_time_wef_upcoming,
      });
    } else {
      this.form.patchValue({
        wef: moment(this.tomorrow).format('YYYY-MM-DD'),
      });
    }

    //flexi can be changed if flexi_time_last_updated is not this month OR IF flexi_time_last_updated is null.
    if(this.data.emp.flexi_time_wef_current){
      const lastUpdated = moment(this.data.emp.flexi_time_wef_current);
      this.lastChangedtext = lastUpdated.format('DD MMM YYYY');
      const today = moment();
      const diff = today.diff(lastUpdated, 'days');
      this.canChangeFlexi = diff >= 25 && today.format('M') !== lastUpdated.format('M');
    }else{
      this.canChangeFlexi = true;
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    const form = this.form.value;
    form.wef = moment(form.wef).format('YYYY-MM-DD');
    this.dialogRef.close(form);
  }

}

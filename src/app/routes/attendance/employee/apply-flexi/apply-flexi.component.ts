import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MtxAlertModule } from '@ng-matero/extensions/alert';
import moment from 'moment';

@Component({
  selector: 'app-apply-flexi',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, MatButtonModule,
    FormsModule, MatFormFieldModule, MatSelectModule, MatIconModule,
    MatInputModule, MatDatepickerModule,
    MtxAlertModule],  templateUrl: './apply-flexi.component.html',
  styleUrl: './apply-flexi.component.css'
})
export class ApplyFlexiComponent implements OnInit{


  canChangeFlexi = false;
  tomorrow = new Date();
  lastChangedtext = 'never';
  timeOptions : { value:number, label : string }[] = [];

  applyFlexiForm = new FormGroup({
    flexi_minutes: new FormControl(0, Validators.required),
    wef: new FormControl('', [
      Validators.required,

    ]),

  });

  constructor() {
    this.tomorrow.setDate( moment().add(1, 'days').date() );
  }


cancel() {
throw new Error('Method not implemented.');
}
applyFlexi() {
throw new Error('Method not implemented.');
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

}

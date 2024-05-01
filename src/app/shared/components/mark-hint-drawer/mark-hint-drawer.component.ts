import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { MTX_DRAWER_DATA, MtxDrawerRef } from '@ng-matero/extensions/drawer';
import moment from 'moment';

@Component({
  selector: 'app-mark-hint-drawer',
  standalone: true,
  imports: [MatRadioModule, MatIconButton, MatIcon, MatFormField,
    MatLabel, MatInput, FormsModule, MatButton, CommonModule, MatDividerModule],
  templateUrl: './mark-hint-drawer.component.html',
  styleUrl: './mark-hint-drawer.component.css'
})
export class MarkHintDrawerComponent implements OnInit {

  constructor(
    public drawerRef: MtxDrawerRef<MarkHintDrawerComponent>,
    @Inject(MTX_DRAWER_DATA) public data: any
  ) { }

  public list: any = [
    { label: 'Casual FN', value: 'casual_fn' },
    { label: 'Casual AN', value: 'casual_an' },
    { label: 'Casual', value: 'casual' },
    { label: 'Comp Leave', value: 'comp_leave' },
    { label: 'Earned', value: 'earned' },
    { label: 'Commutted', value: 'commuted' },
    { label: 'Half-Pay', value: 'halfpay' },
    { label: 'Duty Off', value: 'duty_off' },
    { label: 'Duty', value: 'duty' },
    { label: 'Other', value: 'other' },
    { label: 'Clear', value: 'clear' },
  ];

  selected: string = '';
  canMarkLeave: boolean = false;
  selectedLabel: string = '';
  ngOnInit() {
    this.selected = this.data.punchingInfo.hint || this.data.punchingInfo.computer_hint;

    this.selectedLabel = this.list.find((x:any) => x.value == this.selected)?.label || '';

    if(this.data.monthlyPunching.logged_in_user_is_controller ||
        (this.data.monthlyPunching.logged_in_user_is_section_officer &&
        !this.data.punchingInfo.finalized_by_controller))
    {
      this.canMarkLeave = true;

    }



  }

  onNoClick(): void {
    this.drawerRef.dismiss();
  }

  onOkClick() {

    //save the selected value

    this.drawerRef.dismiss(this.selected);
  }


  getDateExceeded300() {
    return moment(this.data.monthlyPunching.total_grace_exceeded300_date).format('MMM DD');
  }


}

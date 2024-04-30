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

  ngOnInit() {
    this.selected = this.data.punchingInfo.hint || this.data.punchingInfo.computer_hint;
  }

  onNoClick(): void {
    this.drawerRef.dismiss();
  }

  onOkClick() {

    //save the selected value

    this.drawerRef.dismiss(this.selected);
  }
}

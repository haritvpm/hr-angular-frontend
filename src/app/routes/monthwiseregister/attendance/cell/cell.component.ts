import { Component, Input } from '@angular/core';
import { PunchingInfo, MonthlyPunching, MonthlyApiData } from './../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {
  @Input() item : PunchingInfo;
  @Input() calendarInfo : any;

}

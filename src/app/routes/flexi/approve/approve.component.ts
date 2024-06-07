import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-flexi-approve',
  templateUrl: './approve.component.html',
  styleUrl: './approve.component.css',
  standalone: true,
  imports: [PageHeaderComponent]
})
export class FlexiApproveComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

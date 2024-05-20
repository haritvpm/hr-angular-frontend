import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-leaves-approve',
  templateUrl: './approve.component.html',
  styleUrl: './approve.component.css',
  standalone: true,
  imports: [PageHeaderComponent]
})
export class LeavesApproveComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

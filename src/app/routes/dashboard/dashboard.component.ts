import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@shared';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BreadcrumbComponent],
})
export class DashboardComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}
}

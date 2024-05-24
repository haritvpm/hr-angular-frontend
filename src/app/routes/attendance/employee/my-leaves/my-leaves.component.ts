import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { EmployeeLeavesListComponent } from '../employee-leaves-list/employee-leaves-list.component';
import { PendingLeavesListComponent } from '../pending-leaves-list/pending-leaves-list.component';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [  MatTabsModule,
    EmployeeLeavesListComponent, PendingLeavesListComponent],
  templateUrl: './my-leaves.component.html',
  styleUrl: './my-leaves.component.css'
})
export class MyLeavesComponent {

}

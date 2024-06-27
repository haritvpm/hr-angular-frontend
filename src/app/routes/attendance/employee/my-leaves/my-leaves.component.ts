import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { EmployeeLeavesListComponent } from '../employee-leaves-list/employee-leaves-list.component';
import { PendingLeavesListComponent } from '../pending-leaves-list/pending-leaves-list.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-my-leaves',
    standalone: true,
    templateUrl: './my-leaves.component.html',
    styleUrl: './my-leaves.component.css',
    imports: [MatTabsModule,
        EmployeeLeavesListComponent, PendingLeavesListComponent, BreadcrumbComponent]
})
export class MyLeavesComponent {

}

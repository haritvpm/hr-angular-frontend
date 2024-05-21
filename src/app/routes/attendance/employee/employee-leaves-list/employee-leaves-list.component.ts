import { OnInit, Component, Input, ViewChild, inject } from '@angular/core';
import {  MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Leave } from '../interface';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { LeavesService } from 'app/routes/leaves/leaves.service';
@Component({
  selector: 'app-employee-leaves-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  templateUrl: './employee-leaves-list.component.html',
  styleUrl: './employee-leaves-list.component.css'
})
export class EmployeeLeavesListComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly leaveServoce = inject(LeavesService);

  dataSource = new MatTableDataSource<Leave>();
  @Input() set employeeLeaves(value:Leave[]) {
    console.log(value);
    this.dataSource = new MatTableDataSource<Leave>(value);
    this.dataSource.paginator = this.paginator;
  }
  @Input() self = false;

  displayedColumns: string[] = ['period', 'count', 'leave_type', 'reason', 'active_status', 'leave_cat', 'creation_date', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
   // this.dataSource = new MatTableDataSource<Leave>(this.employeeLeaves);

    this.dataSource.paginator = this.paginator;
  }
  getStatusColor(status: string): string {
    if (status == 'Y') {
      return 'LimeGreen';
    }
    if (status == 'N') {
      return 'DeepSkyBlue';
    }
    if (status == 'R') {
      return 'red';
    }
    return 'black';
  }
  getStatusText(status: string): string {
    if (status == 'Y') {
      return 'Approved';
    }
    if (status == 'N') {
      return 'Pending';
    }
    if (status == 'C') {
      return 'Cancelled';
    }
    if (status == 'R') {
      return 'Returned';
    }
    return 'Unknown';

  }

  onApplyLeave() {
    this.router.navigate(['/attendance/self/apply-leave']);
  }

  deleteLeave(leave: Leave) {

    console.log('Deleting leave', leave);
    this.leaveServoce.deleteLeave(leave.id).subscribe(data => {
      console.log('Leave deleted', data);
    });

  }
  editLeave(leave: Leave) {
    console.log('Editing leave', leave);
  }


}


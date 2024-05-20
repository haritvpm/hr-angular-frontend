import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LeaveToApprove, LeavesService } from '../leaves.service';

@Component({
  selector: 'app-leaves-approve',
  templateUrl: './approve.component.html',
  styleUrl: './approve.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule]
})
export class LeavesApproveComponent implements OnInit {
  dataSource = new MatTableDataSource<LeaveToApprove>();
  displayedColumns: string[] = ['employee','period', 'count', 'leave_type', 'reason', 'active_status', 'leave_cat', 'creation_date'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private leaveService: LeavesService) { }

  ngOnInit() {
    this.leaveService.getLeavesToApprove().subscribe(data => {
      this.dataSource.data = data.leaves; // Assign the data.leaves array to the data property of the MatTableDataSource instance
      this.dataSource.paginator = this.paginator; // Assign the paginator property of the MatTableDataSource instance to the paginator property of the component
    });
  }
  getLeaveStatusText(status: string): string {
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
      return 'Rejected';
    }
    return 'Unknown';

  }
}

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
  displayedColumns: string[] = ['employee','period', 'count', 'leave_type', 'reason', 'active_status', 'leave_cat', 'creation_date', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private leaveService: LeavesService) { }

  loadData() {
    this.leaveService.getLeavesToApprove().subscribe(data => {
      this.dataSource.data = data.leaves; // Assign the data.leaves array to the data property of the MatTableDataSource instance
      this.dataSource.paginator = this.paginator; // Assign the paginator property of the MatTableDataSource instance to the paginator property of the component
    });
  }
  ngOnInit() {
    this.loadData();
  }
  getStatusColor(status: string): string {
    if (status == 'Y') {
      return 'LimeGreen';
    }
    if (status == 'N') {
      return 'DeepSkyBlue';
    }
    return 'black';
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
      return 'Returned';
    }
    return 'Unknown';

  }
  approveLeave(leave: LeaveToApprove) {

    this.leaveService.approveLeave(leave.id).subscribe(data => {
      console.log('Leave approved', data);
      this.loadData();
    });
  }
  forwardLeave(leave: LeaveToApprove) {
   this.leaveService.forwardLeave(leave.id).subscribe(data => {
      console.log('Leave forwarded', data);
      this.loadData();
    });

  }
  returnLeave(leave: LeaveToApprove) {
    console.log('Returning leave', leave);
    this.leaveService.returnLeave(leave.id).subscribe(data => {
      console.log('Leave returned', data);
      this.loadData();
    }); 

  }
}

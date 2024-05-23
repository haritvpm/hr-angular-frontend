import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LeaveToApprove, LeavesService } from '../leaves.service';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-leaves-approve',
  templateUrl: './approve.component.html',
  styleUrl: './approve.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule,
    MatIconModule, RouterLink, MatTooltipModule]
})
export class LeavesApproveComponent implements OnInit {
  dataSource = new MatTableDataSource<LeaveToApprove>();
  // displayedColumns: string[] = ['employee', 'period', 'leave_cat', 'count', 'leave_type', 'reason' , 'creation_date',  'active_status', 'approver', 'approved_on', 'action'];
  displayedColumns: string[] = ['employee', 'period', 'leave_cat', 'count', 'leave_type', 'reason' , 'creation_date',  'active_status',  'action'];


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private leaveService: LeavesService, private mtxDialog: MtxDialog) { }

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
  getLeaveStatusText(leave: LeaveToApprove): string {

    if (leave.active_status == 'Y') {
      return 'Approved' ;
    }
    if (leave.active_status == 'N') {
      return 'Pending';
    }
    if (leave.active_status == 'C') {
      return 'Cancelled';
    }
    if (leave.active_status == 'R') {
      return 'Returned';
    }
    return 'Unknown';

  }
  approveLeave(leave: LeaveToApprove) {

    this.mtxDialog.confirm(
      `Approve this leave?`,
      '',
      () => {

        this.leaveService.approveLeave(leave.id).subscribe(data => {
          console.log('Leave approved', data);
          this.loadData();
        });
      },
      () => { }
    );

  }
  forwardLeave(leave: LeaveToApprove) {
    this.leaveService.forwardLeave(leave.id).subscribe(data => {
      console.log('Leave forwarded', data);
      this.loadData();
    });

  }
  returnLeave(leave: LeaveToApprove) {
    console.log('Returning leave', leave);

    this.mtxDialog.confirm(
      `Return to applicant?`,
      '',
      () => {

        this.leaveService.returnLeave(leave.id).subscribe(data => {
          console.log('Leave returned', data);
          this.loadData();
        });
      },
      () => { }
    );



  }
}

import { OnInit, Component, Input, ViewChild } from '@angular/core';
import {  MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Leave } from 'app/routes/monthwiseregister/employee/interface';
@Component({
  selector: 'app-employee-leaves-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './employee-leaves-list.component.html',
  styleUrl: './employee-leaves-list.component.css'
})
export class EmployeeLeavesListComponent implements OnInit {

  dataSource = new MatTableDataSource<Leave>();
  @Input() set employeeLeaves(value:Leave[]) {
    console.log(value);
    this.dataSource = new MatTableDataSource<Leave>(value);
    this.dataSource.paginator = this.paginator;

  }

  displayedColumns: string[] = ['period', 'count', 'leave_type', 'reason', 'active_status', 'leave_cat', 'creation_date'];
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
      return 'Rejected';
    }
    return 'Unknown';

  }

 
   
}


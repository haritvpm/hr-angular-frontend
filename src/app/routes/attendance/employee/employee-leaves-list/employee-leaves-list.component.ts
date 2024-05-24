import { OnInit, Component, Input, ViewChild, inject } from '@angular/core';
import {  MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Leave } from '../interface';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { LeavesService } from 'app/routes/leaves/leaves.service';
import { Observable, filter, of, switchMap } from 'rxjs';
import { AuthService } from '@core/authentication';
@Component({
  selector: 'app-employee-leaves-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  templateUrl: './employee-leaves-list.component.html',
  styleUrl: './employee-leaves-list.component.css'
})
export class EmployeeLeavesListComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly leaveService = inject(LeavesService);
  private readonly auth = inject(AuthService);

  dataSource = new MatTableDataSource<Leave>();
  // @Input() set employeeLeaves(value:Leave[]) {
  //   console.log(value);
  //   this.dataSource = new MatTableDataSource<Leave>(value);
  //   this.dataSource.paginator = this.paginator;
  // }
  // @Input() self = false;
  @Input() aadhaarid: string | undefined = undefined;
  self : boolean = false;

  displayedColumns: string[] = ['period', 'count', 'leave_type', 'reason', 'active_status', 'leave_cat', 'creation_date', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  params$: any;

  ngOnInit() {
    console.log('input aadhaarid', this.aadhaarid);

    
     // Create an observable representing the params
    //   this.params$ = 
    /*this.route.queryParams.pipe(
        switchMap((params: Params) => {
          console.log('Params', params);
          const aadhaarid = params.aadhaarid;
          if ( aadhaarid ) { 
            console.log('params aadhaarid', aadhaarid);
            this.self = false; return of({ aadhaarid}); 
          }
      
           return*/
           this.auth.user()
            .pipe(
                switchMap(user => {
                    console.log(user);
                    if (!user.aadhaarid) {
                        throw new Error('User does not have aadhaarid');
                    }
                    //check if input is defined
                    if (this.aadhaarid) {
                        this.self = false;
                        console.log('input aadhaarid', this.aadhaarid);

                        return of({ aadhaarid: this.aadhaarid });
                    }
                  
                    console.log('user aadhaarid', user.aadhaarid);


                    this.self = true;
                    return of({ aadhaarid: user.aadhaarid });
                })
            )
          
       // })
      //)
      //.pipe(filter(params => !!params))
      .pipe(
        switchMap(params => this.leaveService.getLeavesOfEmployee( params.aadhaarid))
      ).subscribe(leaves => {
        this.dataSource = new MatTableDataSource<Leave>(leaves);
        this.dataSource.paginator = this.paginator;
        console.log('Leavesddddddddddddddddd', leaves);
      });



     // this.dataSource = new MatTableDataSource<Leave>(this.employeeLeaves);
      //this.dataSource.paginator = this.paginator;
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
    this.leaveService.deleteLeave(leave.id).subscribe(data => {
      console.log('Leave deleted', data);
      this.dataSource.data = this.dataSource.data.filter(l => l.id !== leave.id);
    });

  }
  editLeave(leave: Leave) {
    this.router.navigate(['/attendance/self/apply-leave', leave.id]);

  }


}


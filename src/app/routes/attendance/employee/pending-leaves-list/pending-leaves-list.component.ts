import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication';
import { LeavesService } from 'app/routes/leaves/leaves.service';
import { filter, map, of, switchMap } from 'rxjs';
import { Leave, PendingLeave } from '../interface';

@Component({
  selector: 'app-pending-leaves-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  templateUrl: './pending-leaves-list.component.html',
  styleUrl: './pending-leaves-list.component.css'
})
export class PendingLeavesListComponent implements OnInit{
  @Input() self = false;
  @Input() aadhaarid: string | undefined = undefined;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly leaveService = inject(LeavesService);
  private readonly auth = inject(AuthService);

  dataSource = new MatTableDataSource<PendingLeave>();

  displayedColumns: string[] = ['date', 'hint', 'punchings',  'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    console.log('input aadhaarid', this.aadhaarid);


     // Create an observable representing the params
    //   this.params$ =

           this.auth.user()
            .pipe(
                switchMap(user => {
                    console.log(user);
                    if (!user.aadhaarid) {
                        throw new Error('User does not have aadhaarid');
                    }
                    //check if input is defined
                    if (this.aadhaarid) {
                        console.log('input aadhaarid', this.aadhaarid);

                        return of({ aadhaarid: this.aadhaarid, self: false });
                    }

                    console.log('user aadhaarid', user.aadhaarid);


                    return of({ aadhaarid: user.aadhaarid, self: true});
                })
            )
      .pipe(filter(params => !!params), map( x => {this.self = x.self; return x;}) )
      .pipe(
        switchMap(params => this.leaveService.getPendingLeavesOfEmployee( params.aadhaarid))
      ).subscribe(leaves => {
        this.dataSource = new MatTableDataSource<PendingLeave>(leaves);
        this.dataSource.paginator = this.paginator;
        console.log('getPendingLeavesOfEmployee', leaves);
        console.log('self', this.self);
      });



     // this.dataSource = new MatTableDataSource<Leave>(this.employeeLeaves);
      //this.dataSource.paginator = this.paginator;
  }

}

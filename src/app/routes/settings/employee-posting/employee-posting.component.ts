import { PageHeaderComponent } from '@shared';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { EmployeePostingService } from './employee-posting.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AttendanceBook, Employee, MySectionEmployees, Section } from './interfaces';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { filter, switchMap, take } from 'rxjs';
import { EmployeePostingEndComponent } from './employee-posting-end/employee-posting-end.component';
import { Router } from '@angular/router';
import { EmployeePostingEditComponent } from './employee-posting-edit/employee-posting-edit.component';

@Component({
    selector: 'app-settings-employee',
    templateUrl: './employee-posting.component.html',
    standalone: true,
    imports: [PageHeaderComponent,
        MatTableModule,
        MatPaginatorModule, MatFormFieldModule,
        MatSortModule, MatInputModule, MatIconModule,
        FormsModule, CommonModule, ReactiveFormsModule,
        MatButtonModule, BreadcrumbComponent]
})

export class EmployeePostingComponent implements OnInit {



  displayedColumns: string[] = ['aadhaarid', 'employee', 'section',  'startDate', 'flexi_current', 'flexi_upcoming', 'action'];
  dataSource = new MatTableDataSource<Employee>();
  data: Employee[] = [];
  sections : Section[] = [];

  constructor(private employeeService: EmployeePostingService,
    private _liveAnnouncer: LiveAnnouncer, private mtxDialog: MtxDialog, private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.fetchData();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchData(): void {
    this.employeeService.fetchData()
    .pipe(take(1))
    .subscribe((data: MySectionEmployees) => {
      console.log(data);
      this.dataSource.data = data.employees_under_my_section;
      this.dataSource.paginator = this.paginator;
      this.sections = data.sections;
      this.dataSource.sort = this.sort;
    });
  }

  relieveEmployee(emp: Employee)
  {
    const dialogRef = this.mtxDialog.originalOpen(EmployeePostingEndComponent, {
      //width: '550px',
      data: { emp, end_date: ''},
    });

    dialogRef.afterClosed()
    .pipe(
      take(1),
      filter((end_date: any) => end_date !== undefined),
      switchMap((end_date: any) => {
        return this.employeeService.removeEmployee(
          emp.id, end_date );
      }
    )).subscribe(() => {
      this.fetchData();
    });

  }
  editEmployee(emp: Employee) {
    const dialogRef = this.mtxDialog.originalOpen(EmployeePostingEditComponent, {
      //width: '550px',
      data: { emp }  });

    dialogRef.afterClosed()
    .pipe(
      take(1),
      filter((data: any) => data !== undefined),
      switchMap((data: any) => {
        return this.employeeService.updateEmployeeSetting(
          emp.employee_id, data );
      }
    )).subscribe(() => {
      this.fetchData();
    });
    }

  addEmployee() {
    this.router.navigate(['/settings/employee-posting-add'], { state: { sections : this.sections } });
  }

}

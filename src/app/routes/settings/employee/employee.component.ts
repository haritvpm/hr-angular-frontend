import { PageHeaderComponent } from '@shared';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from './employee.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';


export interface Employee {
  id: string;
  employee: string;
  section: string;
  startDate: string;
  endDate: string;
}




export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

/**
 * @title Injecting data when opening a dialog
 */
// @Component({
//   selector: 'dialog-data-example',
//   templateUrl: './employee.component.html',
//   standalone: true,
//   imports: [MatButtonModule],
// })
// export class DialogDataExample {
//   constructor(public dialog: MatDialog) {}

//   openDialog() {
//     this.dialog.open(DialogDataExampleDialog, {
//       data: {
//         animal: 'panda',
//       },
//     });
//   }
// }

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: './dialog-data-example-dialog.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Employee) {}
}


























@Component({
  selector: 'app-settings-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [PageHeaderComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatInputModule, MatIconModule,
    MatButtonModule]
})

export class SettingsEmployeeComponent implements OnInit {

  displayedColumns: string[] = ['id', 'employee', 'section', 'startDate', 'endDate', 'action'];
  dataSource = new MatTableDataSource<Employee>();
  data: Employee[] = [];

  constructor(private employeeService: EmployeeService,
    private _liveAnnouncer: LiveAnnouncer,public dialog: MatDialog) { }
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
    // const url = `http://localhost:3000/employee`;
    // this.httpClient.get<Employee[]>(url).subscribe((data) => {
    this.employeeService.fetchData().subscribe((data: Employee[]) => {

      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  selectEmployee() {
    console.log("shfdkjh");
        this.dialog.open(DialogDataExampleDialog, {
          data: {
            animal: 'panda',
          },
        });
      }

}

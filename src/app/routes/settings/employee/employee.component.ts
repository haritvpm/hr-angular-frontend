import { PageHeaderComponent } from '@shared';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { EmployeeserviceService} from './employeeservice.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface Employee {
  id: string;
  employee: string;
  section: string;
  startDate: string;
  endDate: string;


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

  constructor(private employeeserviceService: EmployeeserviceService ,
    private _liveAnnouncer: LiveAnnouncer ) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.fetchData();
  }
  announceSortChange(sortState: Sort){
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
      this.employeeserviceService.fetchData().subscribe((data: Employee[])=>{

      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


}

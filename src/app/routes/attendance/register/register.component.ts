import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { RegisterService } from './register.service';
import { Post } from './interface';



export interface PostApi {
  punchings: Post[];

}

@Component({
  selector: 'app-mattable-mattableapi',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatInputModule,
    MatDatepickerModule]
})

export class AttendanceRegisterComponent implements OnInit {
  displayedColumns: string[] = ['aadhaarid', 'name', 'designation',
  'section', 'inTrace','outTrace', 'duration_str', 'extra_str',
   'total_extra_sec','grace_str', 'total_grace_sec'];
  dataSource = new MatTableDataSource<Post>();
  data: Post[] = [];

   // Define an array to hold the combined data
combinedData: { name: string, designation: string }[] = [];


  constructor(private registerService: RegisterService, private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.fetchData(null);
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

  fetchData(date: string | null) {
    // const url = date?'/api/v1/punchings/' + date : '/api/v1/punchings/';
    // this.httpClient.get<PostApi>(url).subscribe((data) => {
    this.registerService.fetchData(date).subscribe((data) => {
      this.data = data.punchings;
      console.log(data);

      // console.log(this.data);

      this.dataSource.data = this.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });

  }

  dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value !== null && event.value !== undefined) {
      // const formattedDate = event.value.toISOString().substring(0,10); // Or use any other format method
      const formattedDate = new Date(event.value).toLocaleDateString('pt-br').split('/').reverse().join('-');
      // console.log(formattedDate);
      this.fetchData(formattedDate);
    } else {
      // Handle the case where event.value is undefined
      console.log('Datepicker value is undefined');
    }
  }
  roundValue(value: number): number {
    return Math.round(value);
  }





}

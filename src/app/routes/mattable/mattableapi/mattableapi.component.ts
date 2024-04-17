import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MattableService } from './mattable.service';

interface Post {
  // id: number;
  aadhaarid: string;
  name: string;
  designation: string,
  section:string,

  in_datetime: string;

  out_datetime: string;
  grace_sec: number,
  grace_str: string,
}

export interface PostApi {
  punchings: Post[];

}

@Component({
  selector: 'app-mattable-mattableapi',
  templateUrl: './mattableapi.component.html',
  styleUrls: ['./mattableapi.component.css'],
  standalone: true,
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatInputModule, MatDatepickerModule]
})

export class MattableMattableapiComponent implements OnInit {
  displayedColumns: string[] = ['aadhaarid', 'name', 'designation', 'section',  'in_datetime', 'out_datetime', 'grace_sec', 'grace_str'];
  dataSource = new MatTableDataSource<Post>();
  data: Post[] = [];


  constructor(private mattableService: MattableService, private _liveAnnouncer: LiveAnnouncer) { }

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
    this.mattableService.fetchData(date).subscribe((data) => {
      this.data = data.punchings;
      console.log(data);

      console.log(this.data);

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

}

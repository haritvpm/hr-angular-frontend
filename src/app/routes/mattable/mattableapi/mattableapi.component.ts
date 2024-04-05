import { LiveAnnouncer} from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule} from '@angular/material/datepicker';

interface Post {
  id: number;
  title: string;
  date: Date;
  views: string;
}

@Component({
  selector: 'app-mattable-mattableapi',
  templateUrl: './mattableapi.component.html',
  styleUrls: ['./mattableapi.component.css'],
  standalone: true,
  imports: [HttpClientModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatDatepickerModule]
})

export class MattableMattableapiComponent implements OnInit {
  displayedColumns: string[] = ['id','title', 'date', 'views'];
  dataSource = new MatTableDataSource<Post>();
  data: Post[] = [];

  // events: string[] = [];

  // httpClient = inject(HttpClient);
  // data: any = [];

  constructor(private httpClient: HttpClient, private _liveAnnouncer: LiveAnnouncer ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.fetchData();
  }
  // fetchData() {
  //   this.httpClient.get<Post[]>('https://jsonplaceholder.typicode.com/posts').subscribe((data) => {
  //     // console.log(data);
  //     this.data= data;
  //     this.dataSource.data = this.data;
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;

  //   });
  // }
  fetchData() {
    this.httpClient.get<Post[]>('/api/v1/punchings').subscribe((data) => {
      console.log(data);
      this.data= data;
      this.dataSource.data = this.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
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

  // addEvent(type: string, event: MatDatepickerInputEvent<Post>) {
  //   this.data.push(`${type}: ${event.value}`);
  // }

}

import { Component, OnInit, inject, AfterViewInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '@shared';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-reporttable-apitable',
  templateUrl: './apitable.component.html',
  styleUrls: ['./apitable.component.css'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    RouterOutlet,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class ReporttableApitableComponent implements OnInit, AfterViewInit {
  constructor() {}
  element_data: any[] = [];
  displayedColumns: string[] = ['id', 'aadhaarid', 'att_date', 'att_time'];
  events: string[] = [];

  dataSource = new MatTableDataSource<PeriodicElement>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  httpClient = inject(HttpClient);

  ngOnInit(): void {
    this.fetchData(null);
  }

  fetchData(formatedDate: string | null) {
    let url = formatedDate ? '/api/v1/punchings/' + formatedDate : '/api/v1/punchings/';
    this.httpClient.get<PostApi>(url).subscribe((result_data: any) => {
      console.log(result_data.punchings);
      this.element_data = result_data.punchings;
      this.dataSource.data = result_data.punchings;
    });
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value !== null && event.value !== undefined) {
      console.log(event.value);
      const formatedNewDate = new Date(event.value).toISOString();

      // var formatedDate = new Date(event.value).toLocaleString();
      var formatedDate = new Date(event.value)
        .toLocaleDateString('pt-br')
        .split('/')
        .reverse()
        .join('-');
      // var newdt =  (new Date(event.value)).format('yyyy-MM-dd')
      console.log(formatedNewDate);
      console.log(formatedDate);
      this.fetchData(formatedDate);
    }
  }
}

export interface PeriodicElement {
  id: string;
  aadharid: number;
  att_date: number;
  att_time: string;
}

interface PostApi {
  punchings: PeriodicElement[];
}
